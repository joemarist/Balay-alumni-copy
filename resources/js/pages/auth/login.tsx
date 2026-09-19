import { Form, Head, Link } from '@inertiajs/react';
import { ArrowRight, Leaf, ShieldCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home, register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            <div className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7d1933] text-white shadow-lg shadow-[#7d1933]/20">
                            <Leaf size={18} />
                        </span>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8c6e73]">
                                Member access
                            </p>
                            <p className="font-serif text-xl text-[#32191e]">
                                Balay Alumni
                            </p>
                        </div>
                    </div>
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-2 rounded-full border border-[#eadfd9] bg-white px-3 py-1.5 text-xs font-semibold text-[#7d1933] transition hover:bg-[#fff6f5]"
                    >
                        Back home
                    </Link>
                </div>


                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-[#4b2f34]">
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        className="h-11 rounded-xl border-[#eadfd9] bg-white px-3.5 text-sm text-[#27191b] shadow-sm transition focus-visible:border-[#7d1933] focus-visible:ring-[#7d1933]/20"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password" className="text-sm font-medium text-[#4b2f34]">
                                            Password
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="ml-auto text-xs font-medium text-[#7d1933]"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        className="h-11 rounded-xl border-[#eadfd9] bg-white px-3.5 text-sm text-[#27191b] shadow-sm transition focus-visible:border-[#7d1933] focus-visible:ring-[#7d1933]/20"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-3 rounded-xl border border-[#f0e2e1] bg-[#fffaf9] px-3 py-2.5">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="border-[#d4b8bc] data-[state=checked]:bg-[#7d1933] data-[state=checked]:border-[#7d1933]"
                                    />
                                    <Label htmlFor="remember" className="text-sm text-[#4b2f34]">
                                        Remember me
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 h-11 w-full rounded-xl bg-[#7d1933] text-sm font-bold text-white shadow-lg shadow-[#7d1933]/20 transition hover:bg-[#5e1227]"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner />}
                                    Log in
                                    {!processing && <ArrowRight size={16} className="ml-2" />}
                                </Button>
                            </div>

                            <div className="rounded-2xl border border-[#eadfd9] bg-[#fffaf9] p-3 text-center text-sm text-[#765f63]">
                                Don’t have an account?{' '}
                                <TextLink href={register()} tabIndex={5} className="font-semibold text-[#7d1933]">
                                    Create one
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>

                <div className="flex items-start gap-3 rounded-2xl border border-[#d8d1ab] bg-[#f8f4e8] p-3 text-left text-sm text-[#5f5035]">
                    <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#8b7d3d]" />
                    <span>
                        Secure access for alumni, staff, and event organizers.
                    </span>
                </div>
            </div>

            {status && (
                <div className="mt-5 rounded-xl border border-[#d7f0dd] bg-[#edf9ef] px-3 py-2 text-center text-sm font-medium text-[#235b38]">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
