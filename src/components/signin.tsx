import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import { useLogin } from '@/api/auth'
import { homeFor } from '@/auth/roles'
import { loginSchema, type LoginValues } from '@/features/auth/loginSchema'

import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"

export default function Signin({ changePage }) {
    const login = useLogin()
    const navigate = useNavigate()
    const from = (useLocation().state as { from?: string } | null)?.from
    const [formError, setFormError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { identifier: '', password: '' },
        mode: 'onTouched',
    })

    function onSubmit(values: LoginValues) {
        setFormError(null)
        login.mutate(values, {
            onSuccess: (data) => navigate(from ?? homeFor(data.role), { replace: true }),
            onError: (error) => setFormError(error.message),
        })
    }

    function goToSignupPage() {
        changePage("signup")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet className="flex flex-col gap-y-10">
                <div className="flex flex-col gap-y-1">
                    <FieldLegend className='font-serif' variant='legend'>Welcome back</FieldLegend>
                    <FieldDescription className='font-inter'>Sign in to Vinayaka Cloth Store.</FieldDescription>
                </div>

                {formError && (
                    <p className="text-destructive text-sm">{formError}</p>
                )}

                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="identifier">Phone number or email</FieldLabel>
                        <Input 
                            type="text" 
                            id="identifier" 
                            autoComplete="off" 
                            placeholder="Enter your phone number or email" 
                            {...register("identifier")}
                        />
                        {errors.identifier && (
                            <p className="text-destructive text-xs mt-1">{errors.identifier.message}</p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <div className="relative">
                            <Input 
                                type={showPassword ? 'text' : 'password'} 
                                id="password" 
                                autoComplete="off" 
                                placeholder="Enter your password"
                                {...register("password")}
                            />
                            <Button
                                type="button"
                                onClick={() => setShowPassword((shown) => !shown)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="absolute inset-y-0 right-0 top-2 flex w-11 items-center justify-center text-muted-foreground bg-transparent hover:bg-transparent"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </Button>
                        </div>
                        {errors.password && (
                            <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
                        )}
                    </Field>
                </FieldGroup>

                <div className="flex flex-col gap-y-4">
                    <Button type="submit" className='bg-gold-deep py-6 hover:cursor-pointer'>
                        Sign in
                    </Button>
                    <Button 
                        type="button" 
                        className='bg-primary-foreground text-sm hover:bg-primary-foreground text-muted-foreground hover:cursor-pointer' 
                        onClick={goToSignupPage}
                    >
                        New Here ? <span className="text-gold-deep ml-1">Create Account</span>
                    </Button>
                </div>
                <p className="text-center text-muted-foreground text-xs mt-6">your details stay private always.</p>
            </FieldSet>
        </form>
    )
}