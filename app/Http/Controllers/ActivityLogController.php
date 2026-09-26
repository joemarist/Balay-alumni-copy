<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index()
    {
        $logs = Activity::query()
            ->with(['causer', 'subject'])
            ->latest()
            ->paginate(20);

        $logs->through(function (Activity $log) {
            $causer = $log->causer;
            $subject = $log->subject;

            $causerName = $causer?->name ?? 'System';

            $causerRole = $causer instanceof \App\Models\User
                ? $causer->getRoleNames()->first() ?? 'system'
                : 'system';

            $subjectName = match (true) {
                $subject instanceof \App\Models\User => $subject->name,
                $subject !== null => class_basename($subject) . ' #' . $subject->getKey(),
                default => 'System',
            };

            $level = match ($log->event) {
                'deleted' => 'danger',
                'created' => 'success',
                'updated' => 'warning',
                default => 'info',
            };
            $attributeChanges = $log->attribute_changes ?? [];

            $action = match (true) {
                $subject instanceof \App\Models\Reservation &&
                    $log->event === 'created'
                    => 'Reservation Created',

                $subject instanceof \App\Models\Reservation &&
                    $log->event === 'updated' &&
                    data_get($attributeChanges, 'attributes.status') === 'approved'
                    => 'Reservation Approved',

                $subject instanceof \App\Models\Reservation &&
                    $log->event === 'updated' &&
                    data_get($attributeChanges, 'attributes.status') === 'rejected'
                    => 'Reservation Rejected',

                $subject instanceof \App\Models\Reservation &&
                    $log->event === 'updated' &&
                    data_get($attributeChanges, 'attributes.status') === 'cancelled'
                    => 'Reservation Cancelled',

                $subject instanceof \App\Models\Reservation &&
                    $log->event === 'updated'
                    => 'Reservation Updated',

                $subject instanceof \App\Models\Reservation &&
                    $log->event === 'deleted'
                    => 'Reservation Deleted',

                default => ucfirst($log->event ?? $log->description),
            };

            return [
                'id' => (string) $log->id,
                'timestamp' => $log->created_at?->format('Y-m-d h:i:s A'),
                'causer' => $causerName,
                'causerRole' => $causerRole,
                'subject' => $subjectName,
                'action' => $action,
                'description' => $log->description,
                'level' => $level,
                'properties' => $log->attribute_changes?->toJson() ?? $log->properties?->toJson() ?? '{}',
            ];
        });

        return Inertia::render('activity-logs', [
            'logs' => $logs,
        ]);
    }
}