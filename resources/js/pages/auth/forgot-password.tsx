import { Form, Head } from '@inertiajs/react';
import { ArrowRight, KeyRound, LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password" />

            <div className="space-y-6">
                <div className="rounded-2xl border border-[#eadfd9] bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7d1933] text-white shadow-lg shadow-[#7d1933]/20">
                            <KeyRound size={18} />
                        </div>

                        <div>
                            <h2 className="font-serif text-xl text-[#32191e]">
                                Forgot your password?
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-[#765f63]">
                                Enter the email address associated with your
                                account and we&apos;ll send you a secure link
                                to reset your password.
                            </p>
                        </div>
                    </div>

                    {status && (
                        <div className="mb-5 rounded-xl border border-[#d7f0dd] bg-[#edf9ef] px-4 py-3 text-sm font-medium text-[#235b38]">
                            {status}
                        </div>
                    )}

                    <Form {...email.form()}>
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium text-[#4b2f34]"
                                    >
                                        Email address
                                    </Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        required
                                        placeholder="email@example.com"
                                        className="h-11 rounded-xl border-[#eadfd9] bg-white px-3.5 text-sm text-[#27191b] shadow-sm transition focus-visible:border-[#7d1933] focus-visible:ring-[#7d1933]/20"
                                    />

                                    <InputError message={errors.email} />
                                </div>

                                <div className="my-6">
                                    <Button
                                        type="submit"
                                        className="h-11 w-full rounded-xl bg-[#7d1933] text-sm font-bold text-white shadow-lg shadow-[#7d1933]/20 transition hover:bg-[#5e1227]"
                                        disabled={processing}
                                        data-test="email-password-reset-link-button"
                                    >
                                        {processing && (
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                        )}

                                        Email password reset link

                                        {!processing && (
                                            <ArrowRight
                                                size={16}
                                                className="ml-2"
                                            />
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <div className="text-center text-sm text-[#765f63]">
                    <span>Remember your password? </span>

                    <TextLink
                        href={login()}
                        className="font-semibold !text-[#7d1933] underline decoration-[#7d1933]/40 underline-offset-4 hover:!text-[#5e1227] hover:decoration-[#5e1227]"
                    >
                        Log in
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link',
};
