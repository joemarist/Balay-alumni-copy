<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    /**
     * Verify a user's email address using the signed verification link.
     */
    public function __invoke(Request $request, int $id, string $hash)
    {
        $user = User::findOrFail($id);

        // Make sure the verification link belongs to this user's email.
        if (! hash_equals(
            sha1($user->getEmailForVerification()),
            $hash
        )) {
            abort(403, 'Invalid email verification link.');
        }

        // If the email is already verified, do not process it again.
        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return redirect()
            ->route('login')
            ->with(
                'status',
                'Your email has been successfully verified. You can now log in.'
            );
    }
}
