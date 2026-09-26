<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Reservation;
use App\Models\Venue;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        // Fetch total reservations and total revenue
        $totalReservations = Reservation::count();
        $totalRevenue = Reservation::whereIn('status', ['approved', 'completed'])
        ->sum('total_amount');

        // Fetch the count of active customers
        $activeCustomers = User::role('user')
        ->where('status', 'Active')
        ->count();                          

        // Fetch the count of upcoming events
        $upcomingEvents = Reservation::whereDate('event_date', '>=', today())
        ->whereIn('status', ['pending', 'approved'])
        ->count();
        $totalVenues = Venue::count();
        $availableVenues = Venue::where('available', true)->count();

        $year = now()->year;

        $monthlyReservationStats = Reservation::query()
            ->selectRaw(
                'MONTH(created_at) as month,
                COUNT(*) as total,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as rejected',
                ['rejected']
            )
            ->whereYear('created_at', $year)
            ->groupByRaw('MONTH(created_at)')
            ->get()
            ->keyBy('month');

        $monthlyReservations = collect(range(1, 12))->map(function ($month) use ($monthlyReservationStats) {
            $data = $monthlyReservationStats->get($month);

            $total = (int) ($data?->total ?? 0);
            $rejected = (int) ($data?->rejected ?? 0);

            return [
                'month' => Carbon::create()->month($month)->format('M'),
                'total' => $total,
                'rejected' => $rejected,
                'nonRejected' => $total - $rejected,
            ];
        })->values();

        $monthlyRevenueStats = Reservation::query()
            ->selectRaw(
                'MONTH(event_date) as month,
                SUM(total_amount) as revenue'
            )
            ->whereYear('event_date', $year)
            ->whereIn('status', ['approved', 'completed'])
            ->groupByRaw('MONTH(event_date)')
            ->get()
            ->keyBy('month');

        $revenueTrend = collect(range(1, 12))->map(function ($month) use ($monthlyRevenueStats) {
            $data = $monthlyRevenueStats->get($month);

            return [
                'month' => Carbon::create()->month($month)->format('M'),
                'revenue' => (float) ($data?->revenue ?? 0),
            ];
        })->values();

        return Inertia::render('AdminDashboard', [
            'totalReservations' => $totalReservations,
            'totalRevenue' => $totalRevenue,
            'activeCustomers' => $activeCustomers,
            'upcomingEvents' => $upcomingEvents,
            'totalVenues' => $totalVenues,
            'availableVenues' => $availableVenues,
            'monthlyReservations' => $monthlyReservations,
            'revenueTrend' => $revenueTrend,
        ]);
    }
}