import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, CalendarCheck, Check, ChevronDown, Coffee, Leaf, Menu, Star, X } from 'lucide-react';
import { useState } from 'react';
import { dashboard, login, register } from '@/routes';

type WelcomeVenue = {
    id: number;
    name: string;
    description: string;
    category: 'Function Hall' | 'Conference' | 'Whole Venue';
    minimum_capacity_pax: number;
    maximum_capacity_pax: number;
    rate: string | number;
    rate_duration: string;
    inclusions: string[];
    note: string | null;
    image: string | null;
    available: boolean;
};

type WelcomePackageVenue = {
    id: number;
    name: string;
    minimum_capacity_pax: number;
    maximum_capacity_pax: number;
    pivot: {
        extension_rate_per_hour: number | string;
    };
};

type WelcomePackageAddon = {
    name: string;
    price: number | string;
};

type WelcomePackage = {
    id: number;
    name: string;
    type: 'Basic' | 'Standard' | 'Premium';
    description: string | null;
    price: number | string;
    included_duration_hours: number;
    features: string[];
    addons: WelcomePackageAddon[];
    popular: boolean;
    available: boolean;
    venues: WelcomePackageVenue[];
};

type Props = {
    auth: {
        user?: {
            name?: string;
        } | null;
    };
    venues: WelcomeVenue[];
    packages: WelcomePackage[];
};

const nav = [['Venues', 'venues'], ['Packages', 'packages'], ['Café', 'cafe'], ['Our story', 'story'], ['Contact', 'contact']];
const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });



const menu = [
    ['Signature Espresso', 'Rich double shot, house-roasted beans.', '₱95', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&h=450&fit=crop&auto=format'],
    ['Creamy Cappuccino', 'Velvety microfoam with a bold base.', '₱120', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=450&fit=crop&auto=format'],
    ['Butter Croissant', 'Freshly baked, golden, and flaky.', '₱80', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=450&fit=crop&auto=format'],
    ['Pesto Pasta', 'Al dente pasta with house-made pesto.', '₱195', 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&h=450&fit=crop&auto=format'],
];

export default function Welcome() {
    const { auth, venues, packages } = usePage<Props>().props;

    const [open, setOpen] = useState(false);
    const [selectedVenue, setSelectedVenue] =
        useState<WelcomeVenue | null>(null);
    const [selectedPackage, setSelectedPackage] =
        useState<WelcomePackage | null>(null);
    const cta = auth.user ? dashboard() : register();
    const handleChoosePackage = () => {
        if (auth.user) {
            window.location.href = '/event-packages';
            return;
        }

        window.location.href = '/event-packages/login';
    };
    const close = () => setOpen(false);

    return <>
        <Head title="Venue, café, and memories" />
        <div className="min-h-screen overflow-x-hidden bg-[#fcf8f5] text-[#27191b]">
            <header className="sticky top-0 z-50 border-b border-[#eadfd9] bg-[#fcf8f5]/95 backdrop-blur-md">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
                    <button onClick={() => go('home')} className="flex items-center gap-3 text-left"><span className="flex size-10 items-center justify-center rounded-xl bg-[#7d1933] text-white shadow-lg"><Leaf size={19} /></span><span className="leading-none"><strong className="block font-serif text-lg">Balay Alumni</strong><small className="mt-1 block text-[9px] font-semibold uppercase tracking-[.24em] text-[#8c6e73]">Venue & café</small></span></button>
                    <nav className="hidden items-center gap-8 text-sm font-medium text-[#725b5e] lg:flex">{nav.map(([label, id]) => <button key={id} onClick={() => go(id)} className="hover:text-[#7d1933]">{label}</button>)}</nav>
                    <div className="hidden items-center gap-3 sm:flex">{auth.user ? <Link href={dashboard()} className="rounded-xl bg-[#7d1933] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5e1227]">My dashboard</Link> : <><Link href={login()} className="px-3 py-2 text-sm font-semibold text-[#7d1933]">Sign in</Link><Link href={register()} className="rounded-xl bg-[#7d1933] px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-[#5e1227]">Start planning</Link></>}</div>
                    <button onClick={() => setOpen(!open)} className="p-2 text-[#7d1933] sm:hidden" aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
                </div>
                {open && <div className="border-t border-[#eadfd9] px-5 py-5 sm:hidden"><div className="flex flex-col gap-4 text-sm font-medium text-[#725b5e]">{nav.map(([label, id]) => <button key={id} onClick={() => {
 go(id); close();
}} className="text-left">{label}</button>)}<Link href={cta} onClick={close} className="rounded-xl bg-[#7d1933] px-4 py-3 text-center font-semibold text-white">{auth.user ? 'My dashboard' : 'Start planning'}</Link></div></div>}
            </header>
            <main>
                <section id="home" className="relative overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,#f1d5d4,transparent_35%),linear-gradient(135deg,#fcf8f5,#f5e9e6)]" /><div className="relative mx-auto grid min-h-170 max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:py-24"><div className="max-w-xl"><div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dcb9bd] bg-white/60 px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#7d1933]"><Star size={13} fill="currentColor" /> Where alumni reunite</div><h1 className="font-serif text-5xl font-semibold leading-[1.02] tracking-tight text-[#32191e] sm:text-7xl">Make room for <em className="font-normal text-[#9b4053]">meaningful</em> moments.</h1><p className="mt-7 max-w-lg text-lg leading-8 text-[#765f63]">A warm space for celebrations, conversations, and the memories you will carry home. Plan your next gathering at Balay Alumni.</p><div className="mt-9 flex flex-wrap gap-3"><Link href={cta} className="inline-flex items-center gap-2 rounded-xl bg-[#7d1933] px-6 py-3.5 text-sm font-bold text-white shadow-xl hover:bg-[#5e1227]">Reserve your space <ArrowRight size={16} /></Link><button onClick={() => go('venues')} className="inline-flex items-center gap-2 rounded-xl border border-[#cbaeb0] bg-white/50 px-6 py-3.5 text-sm font-bold text-[#7d1933] hover:bg-white">Explore venues <ChevronDown size={16} /></button></div><div className="mt-12 flex flex-wrap gap-8 border-t border-[#ddc9c7] pt-7"><div><strong className="block font-serif text-3xl text-[#7d1933]">2,800+</strong><span className="text-xs uppercase tracking-wide text-[#8c6e73]">events hosted</span></div><div><strong className="block font-serif text-3xl text-[#7d1933]">15k+</strong><span className="text-xs uppercase tracking-wide text-[#8c6e73]">happy alumni</span></div><div><strong className="block font-serif text-3xl text-[#7d1933]">25</strong><span className="text-xs uppercase tracking-wide text-[#8c6e73]">years of service</span></div></div></div><div className="relative mx-auto w-full max-w-2xl lg:pl-10"><img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=1100&fit=crop&auto=format" alt="Warmly lit event venue prepared for a celebration" className="relative aspect-[.92] w-full rounded-4xl object-cover shadow-2xl" /><div className="absolute -bottom-6 -left-2 rounded-2xl bg-white p-4 shadow-xl sm:-left-8"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-[#f6e9e7] text-[#7d1933]"><CalendarCheck size={22} /></span><div><strong className="block text-sm">Your moment starts here</strong><span className="text-xs text-[#8c6e73]">Venues available today</span></div></div></div></div></div></section>
                <section id="venues" className="scroll-mt-20 bg-white py-24"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#9b4053]">Find your setting</p><h2 className="font-serif text-4xl leading-tight text-[#32191e] sm:text-5xl">Spaces that feel<br /><em className="font-normal">like yours.</em></h2></div><p className="max-w-sm text-sm leading-7 text-[#765f63]">Choose an intimate room for a thoughtful gathering or take over the whole venue for a celebration to remember.</p></div>

                <div className="grid gap-6 md:grid-cols-3">
                {venues.map((venue) => (
                    <article
                        key={venue.id}
                        onClick={() => setSelectedVenue(venue)}
                        className="group cursor-pointer overflow-hidden rounded-2xl border border-[#eadfd9] bg-[#fcf8f5] transition hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={
                                    venue.image ||
                                    '/images/venue/venue-functionhall.png'
                                }
                                alt={venue.name}
                                loading="lazy"
                                className="size-full object-cover transition duration-700 group-hover:scale-105"
                            />

                            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase text-[#7d1933]">
                                {venue.category}
                            </span>
                        </div>

                        <div className="p-6">
                            <h3 className="font-serif text-2xl text-[#32191e]">
                                {venue.name}
                            </h3>

                            <p className="mt-2 text-sm text-[#765f63]">
                                {venue.minimum_capacity_pax}–
                                {venue.maximum_capacity_pax} guests ·{' '}
                                {venue.rate_duration}
                            </p>

                            <div className="mt-6 flex items-center justify-between border-t border-[#eadfd9] pt-4">
                                <span className="font-serif text-xl text-[#7d1933]">
                                    ₱{Number(venue.rate).toLocaleString()}
                                    <small className="ml-1 font-sans text-xs text-[#8c6e73]">
                                        / session
                                    </small>
                                </span>

                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setSelectedVenue(venue);
                                    }}
                                    className="text-sm font-bold text-[#7d1933]"
                                >
                                    View details
                                    <ArrowRight
                                        className="ml-1 inline"
                                        size={14}
                                    />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

                </div></section>

                <section
                id="packages"
                className="scroll-mt-20 bg-[#f5ebe8] py-24"
            >
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                    <div className="mx-auto mb-12 max-w-xl text-center">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#9b4053]">
                            Plan with ease
                        </p>

                        <h2 className="font-serif text-4xl text-[#32191e] sm:text-5xl">
                            Thoughtfully prepared
                            <br />
                            <em className="font-normal">
                                for every occasion.
                            </em>
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {packages.map((pkg) => (
                            <article
                                key={pkg.id}
                                onClick={() => setSelectedPackage(pkg)}
                                className={`group relative flex cursor-pointer flex-col rounded-2xl border p-7 transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                                    pkg.type === 'Standard'
                                        ? 'border-[#7d1933] bg-[#7d1933] text-white shadow-xl'
                                        : pkg.type === 'Premium'
                                        ? 'border-[#c9ded0] bg-[#f1fff6]'
                                        : 'border-[#e0cdca] bg-white/80'
                                }`}
                            >
                                {pkg.popular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e6a9af] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-[#5e1227]">
                                        Most loved
                                    </span>
                                )}

                                <p
                                    className={`text-xs font-bold uppercase tracking-[.2em] ${
                                        pkg.type === 'Standard'
                                            ? 'text-[#f7d8d8]'
                                            : 'text-[#9b4053]'
                                    }`}
                                >
                                    {pkg.type}
                                </p>

                                <h3 className="mt-3 font-serif text-3xl">
                                    {pkg.name}
                                </h3>

                                <p
                                    className={`mt-3 min-h-[72px] text-sm leading-6 ${
                                        pkg.type === 'Standard'
                                            ? 'text-white/75'
                                            : 'text-[#765f63]'
                                    }`}
                                >
                                    {pkg.description}
                                </p>

                                <p
                                    className={`mt-7 font-serif text-3xl ${
                                        pkg.type === 'Standard'
                                            ? 'text-white'
                                            : 'text-[#7d1933]'
                                    }`}
                                >
                                    ₱
                                    {Number(pkg.price).toLocaleString()}
                                    <small className="ml-1 font-sans text-xs opacity-60">
                                        starting
                                    </small>
                                </p>

                                <ul className="mt-7 space-y-3 border-t border-current/15 pt-6 text-sm">
                                    {pkg.features.slice(0, 5).map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-2"
                                        >
                                            <Check
                                                size={16}
                                                className="mt-0.5 shrink-0 text-[#4b9568]"
                                            />

                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleChoosePackage();
                                    }}
                                    className={`mt-8 rounded-xl px-4 py-3 text-center text-sm font-bold ${
                                        pkg.type === 'Standard'
                                            ? 'bg-white text-[#7d1933]'
                                            : 'border border-[#bd969c] text-[#7d1933]'
                                    }`}
                                >
                                    Choose {pkg.name}
                                </button>

                                <p
                                    className={`mt-3 text-center text-xs ${
                                        pkg.type === 'Standard'
                                            ? 'text-white/60'
                                            : 'text-[#8c6e73]'
                                    }`}
                                >
                                    Click the card to view full details
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

                <section id="cafe" className="scroll-mt-20 bg-white py-24"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="mb-12"><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#3d8657]">Pause, sip, stay awhile</p><h2 className="font-serif text-4xl text-[#32191e] sm:text-5xl">Good coffee makes<br /><em className="font-normal">good company better.</em></h2></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{menu.map(([name, description, price, image]) => <article key={name} className="overflow-hidden rounded-2xl border border-[#eadfd9] bg-[#fcf8f5]"><img src={image} alt={name} loading="lazy" className="h-44 w-full object-cover" /><div className="p-5"><h3 className="font-serif text-xl text-[#32191e]">{name}</h3><p className="mt-2 min-h-10 text-xs leading-5 text-[#765f63]">{description}</p><div className="mt-4 flex justify-between"><span className="font-bold text-[#7d1933]">{price}</span><Coffee size={16} className="text-[#3d8657]" /></div></div></article>)}</div></div></section>
                <section id="story" className="scroll-mt-20 bg-[#32191e] px-5 py-24 text-center text-white sm:px-8"><div className="mx-auto max-w-2xl"><p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#e6a9af]">More than a venue</p><h2 className="font-serif text-4xl sm:text-5xl">A place to come back to.</h2><p className="mt-6 text-base leading-8 text-white/65">Balay means home. We built this space so the alumni community always has somewhere to gather, celebrate, and create new stories together.</p><Link href={cta} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-bold text-[#7d1933]">Start planning <ArrowRight size={16} /></Link></div></section>
                <section id="contact" className="scroll-mt-20 bg-[#f5ebe8] px-5 py-20 text-center sm:px-8"><h2 className="font-serif text-4xl text-[#32191e] sm:text-5xl">Let’s make it <em className="font-normal text-[#9b4053]">worth remembering.</em></h2><p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#765f63]">events@balayalumni.ph · +63 82 123 4567</p><Link href={cta} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#7d1933] px-7 py-4 text-sm font-bold text-white">Start planning your event <ArrowRight size={16} /></Link></section>
            </main>
            <footer className="bg-[#211216] px-5 py-10 text-white sm:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between gap-6"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-lg bg-[#7d1933]"><Leaf size={17} /></span><span className="font-serif text-lg">Balay Alumni</span></div><span className="text-right text-xs text-white/45">Balay Alumni Complex, Davao City<br />© {new Date().getFullYear()} Balay Alumni</span></div></footer>

            {selectedVenue && (
            <div
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                onClick={() => setSelectedVenue(null)}
            >
                <div
                    className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="relative">
                        <img
                            src={
                                selectedVenue.image ||
                                '/images/venue/venue-functionhall.png'
                            }
                            alt={selectedVenue.name}
                            className="h-64 w-full object-cover sm:h-80"
                        />

                        <button
                            type="button"
                            onClick={() => setSelectedVenue(null)}
                            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-[#7d1933] shadow"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 sm:p-8">
                        <span className="text-xs font-bold uppercase tracking-[.2em] text-[#9b4053]">
                            {selectedVenue.category}
                        </span>

                        <h2 className="mt-2 font-serif text-3xl text-[#32191e]">
                            {selectedVenue.name}
                        </h2>

                        <p className="mt-4 leading-7 text-[#765f63]">
                            {selectedVenue.description}
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div className="rounded-xl bg-[#fcf8f5] p-4">
                                <p className="text-xs text-[#8c6e73]">
                                    Capacity
                                </p>
                                <p className="mt-1 font-semibold text-[#32191e]">
                                    {selectedVenue.minimum_capacity_pax}–
                                    {selectedVenue.maximum_capacity_pax} pax
                                </p>
                            </div>

                            <div className="rounded-xl bg-[#fcf8f5] p-4">
                                <p className="text-xs text-[#8c6e73]">
                                    Rate
                                </p>
                                <p className="mt-1 font-semibold text-[#32191e]">
                                    ₱{Number(selectedVenue.rate).toLocaleString()}
                                </p>
                            </div>

                            <div className="rounded-xl bg-[#fcf8f5] p-4">
                                <p className="text-xs text-[#8c6e73]">
                                    Duration
                                </p>
                                <p className="mt-1 font-semibold text-[#32191e]">
                                    {selectedVenue.rate_duration}
                                </p>
                            </div>
                        </div>

                        {selectedVenue.inclusions?.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-semibold text-[#32191e]">
                                    What's included
                                </h3>

                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {selectedVenue.inclusions.map((inclusion) => (
                                        <div
                                            key={inclusion}
                                            className="flex items-center gap-2 text-sm text-[#765f63]"
                                        >
                                            <Check
                                                size={16}
                                                className="shrink-0 text-emerald-600"
                                            />
                                            {inclusion}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedVenue.note && (
                            <p className="mt-6 rounded-xl bg-[#f5ebe8] p-4 text-sm text-[#7d1933]">
                                {selectedVenue.note}
                            </p>
                        )}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => setSelectedVenue(null)}
                                className="rounded-xl border border-[#cbaeb0] px-6 py-3 text-sm font-semibold text-[#7d1933]"
                            >
                                Close
                            </button>

                            <a
                                href="/venues"
                                className="flex-1 rounded-xl bg-[#7d1933] px-6 py-3 text-center text-sm font-bold text-white hover:bg-[#5e1227]"
                            >
                                Book Now
                                <ArrowRight
                                    className="ml-2 inline"
                                    size={16}
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </div>

        {selectedPackage && (
            <div
                className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                onClick={() => setSelectedPackage(null)}
            >
                <div
                    className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="relative bg-[#7d1933] px-6 py-8 text-white sm:px-8">
                        <button
                            type="button"
                            onClick={() => setSelectedPackage(null)}
                            className="absolute right-4 top-4 rounded-full bg-white/15 p-2 transition hover:bg-white/25"
                        >
                            <X size={20} />
                        </button>

                        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e6a9af]">
                            {selectedPackage.type} Package
                        </p>

                        <h2 className="mt-2 font-serif text-4xl">
                            {selectedPackage.name}
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                            {selectedPackage.description}
                        </p>

                        <div className="mt-6 flex flex-wrap items-end gap-6">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-white/60">
                                    Package price
                                </p>

                                <p className="mt-1 font-serif text-3xl font-bold">
                                    ₱
                                    {Number(
                                        selectedPackage.price,
                                    ).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wide text-white/60">
                                    Included duration
                                </p>

                                <p className="mt-1 text-lg font-semibold">
                                    {selectedPackage.included_duration_hours}{' '}
                                    hours
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-7 p-6 sm:p-8">
                        {/* Features */}
                        <section>
                            <h3 className="font-serif text-2xl text-[#32191e]">
                                What's included
                            </h3>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {selectedPackage.features.map(
                                    (feature) => (
                                        <div
                                            key={feature}
                                            className="flex items-start gap-3 rounded-xl bg-[#fcf8f5] p-3"
                                        >
                                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#edf7ef]">
                                                <Check
                                                    size={13}
                                                    className="text-[#3d8657]"
                                                    strokeWidth={3}
                                                />
                                            </span>

                                            <span className="text-sm text-[#765f63]">
                                                {feature}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </section>

                        {/* Venues */}
                        <section>
                            <h3 className="font-serif text-2xl text-[#32191e]">
                                Available venues
                            </h3>

                            <div className="mt-4 space-y-3">
                                {selectedPackage.venues.map(
                                    (venue) => (
                                        <div
                                            key={venue.id}
                                            className="rounded-xl border border-[#eadfd9] p-4"
                                        >
                                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                                <div>
                                                    <p className="font-semibold text-[#32191e]">
                                                        {venue.name}
                                                    </p>

                                                    <p className="mt-1 text-sm text-[#765f63]">
                                                        Capacity:{' '}
                                                        {
                                                            venue.minimum_capacity_pax
                                                        }
                                                        –
                                                        {
                                                            venue.maximum_capacity_pax
                                                        }{' '}
                                                        pax
                                                    </p>
                                                </div>

                                                <p className="text-sm font-semibold text-[#7d1933]">
                                                    Extension: ₱
                                                    {Number(
                                                        venue.pivot
                                                            .extension_rate_per_hour,
                                                    ).toLocaleString()}
                                                    /hour
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </section>

                        {/* Add-ons */}
                        {selectedPackage.addons.length > 0 && (
                            <section>
                                <h3 className="font-serif text-2xl text-[#32191e]">
                                    Optional add-ons
                                </h3>

                                <div className="mt-4 space-y-2">
                                    {selectedPackage.addons.map(
                                        (addon) => (
                                            <div
                                                key={addon.name}
                                                className="flex justify-between rounded-xl bg-[#fcf8f5] px-4 py-3 text-sm"
                                            >
                                                <span className="text-[#765f63]">
                                                    {addon.name}
                                                </span>

                                                <span className="font-semibold text-[#7d1933]">
                                                    ₱
                                                    {Number(
                                                        addon.price,
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Footer */}
                        <div className="flex flex-col gap-3 border-t border-[#eadfd9] pt-6 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedPackage(null)}
                                className="rounded-xl border border-[#d7c2c4] px-6 py-3 text-sm font-semibold text-[#7d1933]"
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                onClick={handleChoosePackage}
                                className="rounded-xl bg-[#7d1933] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#5e1227]"
                            >
                                Choose {selectedPackage.name}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>;
}
