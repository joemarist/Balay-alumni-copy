<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;
use Illuminate\Validation\ValidationException;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);

        Fortify::authenticateUsing(function (Request $request) {
            $user = User::where('email', $request->email)->first();

            /*
            |--------------------------------------------------------------------------
            | 1. User does not exist
            |--------------------------------------------------------------------------
            */
            if (! $user) {
                return null;
            }

            /*
            |--------------------------------------------------------------------------
            | 2. Password is incorrect
            |--------------------------------------------------------------------------
            */
            if (! Hash::check(
                $request->password,
                $user->getRawOriginal('password')
            )) {
                return null;
            }

            /*
            |--------------------------------------------------------------------------
            | 3. Password is correct, but email is not verified
            |--------------------------------------------------------------------------
            */
            if (! $user->hasVerifiedEmail()) {
                throw ValidationException::withMessages([
                    'email' => 'Your email address has not been verified yet. Please check your email and click the verification link before logging in.',
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | 4. Email is verified but status is still inactive
            |--------------------------------------------------------------------------
            | This repairs older accounts that were verified before this fix.
            */
            if (strtolower((string) $user->status) === 'inactive') {
                $user->forceFill([
                    'status' => 'Active',
                ])->save();
            }

            /*
            |--------------------------------------------------------------------------
            | 5. Account is not active
            |--------------------------------------------------------------------------
            */
            if (strtolower((string) $user->status) !== 'active') {
                throw ValidationException::withMessages([
                    'email' => 'Your account is currently unavailable. Please contact the administrator.',
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | 6. Everything is correct
            |--------------------------------------------------------------------------
            */
            return $user;
        });
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn () => Inertia::render('auth/register', [
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('passkeys', function (Request $request) {
            return Limit::perMinute(10)->by(
                ($request->input('credential.id') ?: $request->session()->getId()).'|'.$request->ip(),
            );
        });
    }
}
