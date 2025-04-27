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
import EmailIcon from '@mui/icons-material/Email';
import useMutateApi from "@/Hooks/useMutateApi";

type TRegisterForm = {
    username: string,
    email: string,
    password: string
}

const initialValues: TRegisterForm = {
    username: '',
    email: '',
    password: ''
}

export default function RegisterPage() {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialValues
    });

    const [showPassword, setShowPassword] = useState(false);
    const [registerError, setRegisterError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const [registerApi, registerApiLoading] = useMutateApi({
        apiPath: `/auth/register`,
        method: 'POST',
    });

    const onSubmit = async (data: TRegisterForm) => {
        setRegisterError('');

        try {
            const registerResponse = await registerApi(data);
            if (registerResponse.data.success) {
                console.log('Registration successful:', registerResponse);
                setIsRegistered(true);
            } else {
                setRegisterError(registerResponse.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setRegisterError('An error occurred during registration. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <Paper className="w-full max-w-md p-8 shadow-lg rounded-lg">
                <div className="text-center mb-8">
                    <Typography variant="h4" className="text-primary-700 font-bold mb-2">
                        Create Account
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                        Join us and start sharing your knowledge
                    </Typography>
                </div>

                {isRegistered ? (
                    <Alert severity="success" className="mb-4">
                        Registration successful! You can now login with your credentials.
                        <div className="mt-4">
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                href="/login"
                                className="bg-primary-600 hover:bg-primary-700"
                            >
                                Go to Login
                            </Button>
                        </div>
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
                        {registerError && (
                            <Alert severity="error" className="mb-4">
                                {registerError}
                            </Alert>
                        )}

                        <Controller
                            name="username"
                            control={control}
                            rules={{
                                required: "Username is required",
                                minLength: {
                                    value: 3,
                                    message: "Username must be at least 3 characters long"
                                }
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
                            name="email"
                            control={control}
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    className="bg-white"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon className="text-gray-500" />
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
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters long"
                                }
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

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            disabled={registerApiLoading}
                            className="bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-200 mt-4"
                        >
                            {registerApiLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Create Account"
                            )}
                        </Button>

                        <Divider className="my-6">
                            <Typography variant="body2" className="text-gray-500 px-2">
                                OR
                            </Typography>
                        </Divider>

                        <div className="text-center">
                            <Typography variant="body2" className="text-gray-600">
                                Already have an account?{' '}
                                <a href="/login" className="text-primary-600 hover:text-primary-800 font-medium">
                                    Sign in
                                </a>
                            </Typography>
                        </div>
                    </form>
                )}
            </Paper>
        </div>
    );
}