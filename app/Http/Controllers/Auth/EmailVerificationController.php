<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Auth;

class EmailVerificationController extends Controller
{
    /**
     * Verify the user's email address.
     */
    public function verify(Request $request, int $id, string $hash)
    {
        $user = User::findOrFail($id);

        /*
        |--------------------------------------------------------------------------
        | Check that the email hash belongs to this user.
        |--------------------------------------------------------------------------
        */
        if (! hash_equals(
            sha1($user->getEmailForVerification()),
            $hash
        )) {
            abort(403, 'Invalid email verification link.');
        }

        /*
        |--------------------------------------------------------------------------
        | Check that the verification URL is still valid.
        |--------------------------------------------------------------------------
        */
        if (! URL::hasValidSignature($request)) {
            abort(403, 'This email verification link is invalid or has expired.');
        }

        /*
        |--------------------------------------------------------------------------
        | Verify the email and activate the account.
        |--------------------------------------------------------------------------
        */
        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        /*
        |--------------------------------------------------------------------------
        | Redirect the user to login.
        |--------------------------------------------------------------------------
        */
        return redirect()
            ->route('login')
            ->with(
                'status',
                'Your email has been successfully verified. You can now log in.'
            );
    }
}
