'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField,
    Button,
    Typography,
    Paper,
    IconButton,
    InputAdornment,
    Alert,
    Divider,
    CircularProgress
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import useMutateApi from "@/Hooks/useMutateApi";
import {useRouter} from "next/navigation";

type TLoginForm = {
    username: string,
    password: string
}

const initialValues: TLoginForm = {
    username: '',
    password: ''
}

export default function LoginPage() {
    const router  = useRouter();

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialValues
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [loginApi, loginApiLoading] = useMutateApi({
        apiPath: `/auth/login`,
        method: 'POST',
    });

    const onSubmit = async (data: TLoginForm) => {
        setLoginError('');

        try {
            const loginResponse = await loginApi(data);

            if (loginResponse.data.success) {
                console.log('Login successful:', loginResponse);
                localStorage.setItem('authToken', loginResponse.token);
                localStorage.setItem('user', JSON.stringify(loginResponse.user));
                setIsLoggedIn(true);
                router.push('/course-list');
            } else {
                setLoginError(loginResponse.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('An error occurred during login. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <Paper className="w-full max-w-md p-8 shadow-lg rounded-lg">
                <div className="text-center mb-8">
                    <Typography variant="h4" className="text-primary-700 font-bold mb-2">
                        Sign In
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                        Welcome back! Please enter your details
                    </Typography>
                </div>

                {isLoggedIn ? (
                    <Alert severity="success" className="mb-4">
                        Login successful! Redirecting to your dashboard...
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
                        {loginError && (
                            <Alert severity="error" className="mb-4">
                                {loginError}
                            </Alert>
                        )}

                        <Controller
                            name="username"
                            control={control}
                            rules={{
                                required: "Username is required"
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Username"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.username}
                                    helperText={errors.username?.message}
                                    className="bg-white"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutlineIcon className="text-gray-500" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: "Password is required"
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Password"
                                    variant="outlined"
                                    fullWidth
                                    type={showPassword ? "text" : "password"}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    className="bg-white"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    className="text-gray-600"
                                                >
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />

                        <div className="text-right">
                            <a href="#" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                                Forgot password?
                            </a>
                        </div>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            disabled={loginApiLoading}
                            className="bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            {loginApiLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Sign In"
                            )}
                        </Button>

                        <Divider className="my-6">
                            <Typography variant="body2" className="text-gray-500 px-2">
                                OR
                            </Typography>
                        </Divider>

                        {/* Register Link */}
                        <div className="text-center mt-4">
                            <Typography variant="body2" className="text-gray-600">
                                Dont have an account?{' '}
                                <a href="/register" className="text-primary-600 hover:text-primary-800 font-medium">
                                    Create an account
                                </a>
                            </Typography>
                        </div>
                    </form>
                )}
            </Paper>
        </div>
    );
}