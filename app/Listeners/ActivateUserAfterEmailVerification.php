<?php

namespace App\Listeners;

use App\Models\User;
use Illuminate\Auth\Events\Verified;

class ActivateUserAfterEmailVerification
{
    /**
     * Handle the event.
     */
    public function handle(Verified $event): void
    {
        if ($event->user instanceof User) {
            $event->user->forceFill([
                'status' => 'Active',
            ])->save();
        }
    }
}
