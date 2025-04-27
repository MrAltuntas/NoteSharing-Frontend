'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    InputAdornment,
    Chip,
    Box,
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClassIcon from '@mui/icons-material/Class';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMutateApi from "@/Hooks/useMutateApi";

type TCourseForm = {
    title: string,
    description: string,
    instructor: string
}

const initialValues: TCourseForm = {
    title: '',
    description: '',
    instructor: ''
}

export default function CreateCoursePage() {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: initialValues
    });

    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [courseError, setCourseError] = useState('');
    const [isCreated, setIsCreated] = useState(false);
    const [createdCourse, setCreatedCourse] = useState<any>(null);

    // Use the custom API hook for course creation
    const [createCourseApi, createCourseLoading] = useMutateApi({
        apiPath: `/courses`,
        method: 'POST',
    });

    const handleAddTag = () => {
        if (tagInput && !tags.includes(tagInput)) {
            setTags([...tags, tagInput]);
            setTagInput('');
        }
    };

    const handleDeleteTag = (tagToDelete: string) => {
        setTags(tags.filter(tag => tag !== tagToDelete));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput) {
            e.preventDefault();
            handleAddTag();
        }
    };

    const onSubmit = async (data: TCourseForm) => {
        setCourseError('');

        try {
            // Combine form data with tags
            const courseData = {
                ...data,
                tags: tags
            };

            const response = await createCourseApi(courseData);

            if (response.data.success) {
                console.log('Course created successfully:', response);
                setIsCreated(true);
                setCreatedCourse(response.data.course);
                reset();
                setTags([]);
            } else {
                setCourseError(response.data.message || 'Failed to create course. Please try again.');
            }
        } catch (error) {
            console.error('Course creation error:', error);
            setCourseError('An error occurred while creating the course. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Button
                    startIcon={<ArrowBackIcon />}
                    href="/course-list"
                    variant="text"
                    className="mb-6 text-primary-600"
                >
                    Back to Courses
                </Button>

                <Paper className="p-8 shadow-lg rounded-lg">
                    <div className="text-center mb-8">
                        <Typography variant="h4" className="text-primary-700 font-bold mb-2">
                            Create New Course
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                            Fill out the details to create a new course
                        </Typography>
                    </div>

                    {isCreated ? (
                        <div>
                            <Alert severity="success" className="mb-6">
                                Course created successfully!
                            </Alert>

                            <Box className="bg-gray-50 p-6 rounded-lg mb-6">
                                <Typography variant="h6" className="mb-4 font-bold">
                                    Course Details:
                                </Typography>
                                <Typography variant="body1" className="mb-2">
                                    <strong>Title:</strong> {createdCourse.title}
                                </Typography>
                                <Typography variant="body1" className="mb-2">
                                    <strong>Description:</strong> {createdCourse.description}
                                </Typography>
                                <Typography variant="body1" className="mb-2">
                                    <strong>Instructor:</strong> {createdCourse.instructor}
                                </Typography>
                                <div className="mt-4">
                                    <Typography variant="body2" className="mb-1 font-semibold">
                                        Tags:
                                    </Typography>
                                    <div className="flex flex-wrap gap-2">
                                        {createdCourse.tags && createdCourse.tags.map((tag: string, index: number) => (
                                            <Chip key={index} label={tag} size="small" />
                                        ))}
                                        {(!createdCourse.tags || createdCourse.tags.length === 0) && (
                                            <Typography variant="body2" className="text-gray-500 italic">
                                                No tags added
                                            </Typography>
                                        )}
                                    </div>
                                </div>
                            </Box>

                            <div className="flex gap-4 justify-center">

                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setIsCreated(false);
                                        setCreatedCourse(null);
                                    }}
                                >
                                    Create Another Course
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
                            {courseError && (
                                <Alert severity="error" className="mb-4">
                                    {courseError}
                                </Alert>
                            )}

                            <Controller
                                name="title"
                                control={control}
                                rules={{
                                    required: "Course title is required"
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Course Title"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
                                        className="bg-white"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ClassIcon className="text-gray-500" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Course Description"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                        className="bg-white"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <DescriptionIcon className="text-gray-500" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            <Controller
                                name="instructor"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Instructor"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.instructor}
                                        helperText={errors.instructor?.message}
                                        className="bg-white"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon className="text-gray-500" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            <div>
                                <Typography variant="body2" className="mb-2 text-gray-700">
                                    Course Tags (optional)
                                </Typography>
                                <div className="flex items-center gap-2 mb-2">
                                    <TextField
                                        label="Add Tag"
                                        variant="outlined"
                                        size="small"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        fullWidth
                                        className="bg-white"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocalOfferIcon className="text-gray-500" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <IconButton
                                        onClick={handleAddTag}
                                        color="primary"
                                        className="bg-primary-100 hover:bg-primary-200"
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {tags.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            onDelete={() => handleDeleteTag(tag)}
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                        />
                                    ))}
                                    {tags.length === 0 && (
                                        <Typography variant="body2" className="text-gray-500 italic">
                                            No tags added yet
                                        </Typography>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                disabled={createCourseLoading}
                                className="bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-200 mt-4"
                            >
                                {createCourseLoading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    "Create Course"
                                )}
                            </Button>
                        </form>
                    )}
                </Paper>
            </div>
        </div>
    );
}