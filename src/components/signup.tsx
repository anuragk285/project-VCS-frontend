import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { isApiError } from '@/api/errors'
import { useSignUp } from '@/api/auth'
import { useLocation, useNavigate } from 'react-router'
import { homeFor } from '@/auth/roles'
import { useState } from "react"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { signupSchema, signupDefaults, type SignupValues, toRegisterInput } from '@/features/auth/signupSchema'

export default function Signup({ changePage }) {
    const signUp = useSignUp()
    const navigate = useNavigate()
    const from = (useLocation().state as { from?: string } | null)?.from
    const [formError, setFormError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: signupDefaults,
        mode: 'onTouched',
    })

    function onSubmit(values: SignupValues) {
        setFormError(null)
        signUp.mutate(toRegisterInput(values), {
            onSuccess: (data) => navigate(from ?? homeFor(data.role), { replace: true }),
            onError: (error) => {
                if (isApiError(error) && error.fieldErrors) {
                    for (const [field, message] of Object.entries(error.fieldErrors)) {
                        if (field === 'name' || field === 'phone' || field === 'email' || field === 'password') {
                            setError(field as keyof SignupValues, { message })
                        }
                    }
                }
                setFormError(error.message)
            },
        })
    }

    function goToSigninPage() {
        changePage("signin")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet className="flex flex-col gap-y-5">
                <FieldLegend className='font-serif mb-6' variant='legend'>Create your account</FieldLegend>

                {formError && (
                    <p className="text-destructive text-sm">{formError}</p>
                )}

                <FieldGroup className="flex flex-col gap-y-3">
                    <Field>
                        <FieldLabel htmlFor="full-name">Full name</FieldLabel>
                        <Input type="text" id="full-name" autoComplete="off" placeholder="Enter your full name" {...register("name")} />
                        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                        <Input type="text" id="phone" autoComplete="off" placeholder="Enter your phone number" {...register("phone")} />
                        {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="email">Email (optional)</FieldLabel>
                        <Input type="email" id="email" placeholder="you@example.com" {...register("email")} />
                        {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                    </Field>

                    <p className="text-muted-foreground text-xs">Give a phone number or an email. Both are welcome</p>

                    <Field>
                        <FieldLabel htmlFor="password">Create Password</FieldLabel>
                        <div className="relative">
                            <Input type={showPassword ? 'text' : 'password'} id="password" autoComplete="off" placeholder="Create a password" {...register("password")} />
                            <Button
                                type="button"
                                onClick={() => setShowPassword((shown) => !shown)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="absolute inset-y-0 right-0 top-2 flex w-11 items-center justify-center text-muted-foreground bg-transparent hover:bg-transparent"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </Button>
                        </div>
                        {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
                    </Field>
                </FieldGroup>

                <div className="flex flex-col gap-y-4 mt-4">
                    <Button type="submit" className='bg-gold-deep py-6 hover:cursor-pointer'>Sign up</Button>
                    <Button type="button" className='bg-primary-foreground text-sm hover:bg-primary-foreground text-muted-foreground hover:cursor-pointer font-normal' onClick={goToSigninPage}>
                        Already have an account ? <span className="text-gold-deep ml-1">Sign in</span>
                    </Button>
                </div>
            </FieldSet>
        </form>
    )
}