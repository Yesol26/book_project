'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { LoginRequest, SignupRequest } from '@/types/auth';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: authApi.getCurrentUser,
        retry: false,
    });

    const loginMutation = useMutation({
        mutationFn: (data: LoginRequest) => authApi.login(data),
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            queryClient.setQueryData(['user'], data.user);
            router.push('/');
        },
    });

    const signupMutation = useMutation({
        mutationFn: (data: SignupRequest) => authApi.signup(data),
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            queryClient.setQueryData(['user'], data.user);
            router.push('/');
        },
    });

    const logout = async () => {
        await authApi.logout();
        queryClient.setQueryData(['user'], null);
        router.push('/login');
    };

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        login: loginMutation.mutate,
        signup: signupMutation.mutate,
        logout,
        isLoginLoading: loginMutation.isPending,
        isSignupLoading: signupMutation.isPending,
    };
}
