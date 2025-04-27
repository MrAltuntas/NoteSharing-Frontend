'use client';
import { useState, useEffect } from 'react';
import {
    Typography,
    Paper,
    TextField,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Chip,
    CircularProgress,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    InputAdornment,
    Alert,
    Box,
    Rating
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SortIcon from '@mui/icons-material/Sort';
import ClassIcon from '@mui/icons-material/Class';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useMutateApi from "@/Hooks/useMutateApi";

// Define course type
type Course = {
    id: number;
    title: string;
    description: string;
    instructor: string;
    createdAt: string;
    updatedAt: string;
    rating: number;
    totalRatings: number;
    totalVisits: number;
    tags: string[];
};

export default function CourseListPage() {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sort, setSort] = useState("title,asc");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Course data state
    const [courses, setCourses] = useState<Course[]>([]);
    const [totalCourses, setTotalCourses] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const [getCourses, getCoursesLoading] = useMutateApi({
        apiPath: '/courses',
        method: 'GET',
    });

    const [searchCourses, searchCoursesLoading] = useMutateApi({
        apiPath: '/courses/search',
        method: 'GET',
    });

    const loading = isSearching ? searchCoursesLoading : getCoursesLoading;


    const fetchData = async () => {
        const getCoursesResponse = await getCourses({}, {
            page: page,
            size: size,
            sort: sort
        });

        if (getCoursesResponse.data.success) {
            setCourses(getCoursesResponse.data.courses);
        }
    }
    useEffect(() => {
        fetchData();
    }, [page, size, sort]);

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            try {
                setIsSearching(true);
                const searchCoursesResponse = await searchCourses({}, { query: searchQuery });

                if (searchCoursesResponse.data.success){
                    setCourses(searchCoursesResponse.data.results);
                }
            } catch (err) {
                setError('Search failed. Please try again.');
                console.error('Search error:', err);
            }
        } else {
            fetchData();
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        fetchData();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1);
    };

    const handleChangeSize = (event: any) => {
        setSize(event.target.value);
        setPage(0);
    };

    const handleChangeSort = (event: any) => {
        setSort(event.target.value);
    };

    // Calculate total pages
    const totalPages = Math.ceil(totalCourses / size);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <Typography variant="h4" className="text-primary-700 font-bold">
                            <ClassIcon className="mr-2 mb-1" fontSize="large" />
                            Course Catalog
                        </Typography>
                        <Typography variant="body1" className="text-gray-600 mt-1">
                            Browse and discover courses
                        </Typography>
                    </div>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        href="/create-course"
                        className="bg-primary-600 hover:bg-primary-700"
                    >
                        Create Course
                    </Button>
                </div>

                {/* Search and Filters */}
                <Paper className="p-4 mb-8 shadow-md">
                    <Grid container spacing={3} alignItems="center">
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                placeholder="Search courses by title, description, or tags"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon className="text-gray-500" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchQuery && (
                                        <InputAdornment position="end">
                                            <Button
                                                size="small"
                                                onClick={clearSearch}
                                                variant="text"
                                                className="text-gray-500"
                                            >
                                                Clear
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid size={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleSearch}
                                disabled={loading}
                                className="bg-primary-600 hover:bg-primary-700 h-14"
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
                            </Button>
                        </Grid>

                        <Grid size={3}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="sort-select-label">Sort By</InputLabel>
                                <Select
                                    labelId="sort-select-label"
                                    value={sort}
                                    onChange={handleChangeSort}
                                    label="Sort By"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <SortIcon className="text-gray-500" />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="title,asc">Title (A-Z)</MenuItem>
                                    <MenuItem value="title,desc">Title (Z-A)</MenuItem>
                                    <MenuItem value="createdAt,desc">Newest First</MenuItem>
                                    <MenuItem value="createdAt,asc">Oldest First</MenuItem>
                                    <MenuItem value="rating,desc">Highest Rated</MenuItem>
                                    <MenuItem value="totalVisits,desc">Most Popular</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Status and Results */}
                {isSearching && (
                    <Box className="mb-4">
                        <Typography variant="body1" className="text-gray-700 mb-2">
                            Search results for: <strong>{searchQuery}</strong>
                            <Button
                                size="small"
                                variant="text"
                                onClick={clearSearch}
                                className="ml-2 text-primary-600"
                            >
                                Clear search
                            </Button>
                        </Typography>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <CircularProgress />
                    </div>
                ) : courses.length === 0 ? (
                    <Paper className="p-8 text-center">
                        <Typography variant="h6" className="text-gray-600 mb-2">
                            No courses found
                        </Typography>
                        <Typography variant="body2" className="text-gray-500">
                            {isSearching
                                ? "Try adjusting your search terms or clear the search to see all courses."
                                : "There are no courses available yet. Be the first to create one!"}
                        </Typography>
                        {isSearching && (
                            <Button
                                variant="outlined"
                                onClick={clearSearch}
                                className="mt-4"
                            >
                                View All Courses
                            </Button>
                        )}
                    </Paper>
                ) : (
                    <>
                        {/* Courses Grid */}
                        <Grid container spacing={4} className="mb-6">
                            {courses.map((course) => (
                                <Grid size={4} key={course.id}>
                                    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                                        <CardContent className="flex-grow">
                                            <Typography variant="h6" className="font-bold mb-2 text-primary-700">
                                                {course.title}
                                            </Typography>
                                            <div className="flex items-center mb-3">
                                                <PersonIcon fontSize="small" className="text-gray-500 mr-1" />
                                                <Typography variant="body2" className="text-gray-600">
                                                    {course.instructor || "Unknown Instructor"}
                                                </Typography>
                                            </div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Rating
                                                    value={course.rating}
                                                    precision={0.5}
                                                    readOnly
                                                    size="small"
                                                />
                                                <Typography variant="body2" className="text-gray-500">
                                                    ({course.totalRatings || 0})
                                                </Typography>
                                                <Box className="flex items-center ml-2 text-gray-500">
                                                    <VisibilityIcon fontSize="small" className="mr-1" />
                                                    <Typography variant="body2">
                                                        {course.totalVisits || 0}
                                                    </Typography>
                                                </Box>
                                            </div>
                                            <Typography variant="body2" className="text-gray-600 mb-4 line-clamp-3">
                                                {course.description || "No description available"}
                                            </Typography>
                                            <div className="flex flex-wrap gap-1 mt-auto">
                                                {course.tags && course.tags.map((tag, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={tag}
                                                        size="small"
                                                        variant="outlined"
                                                        className="text-xs"
                                                    />
                                                ))}
                                            </div>
                                        </CardContent>
                                        <CardActions className="bg-gray-50 p-3">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                href={`/courses/${course.id}`}
                                                className="bg-primary-600 hover:bg-primary-700"
                                            >
                                                View Course
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Pagination */}
                        <div className="flex flex-col md:flex-row justify-between items-center mt-8 mb-4">
                            <div className="mb-4 md:mb-0">
                                <Typography variant="body2" className="text-gray-600">
                                    Showing {courses.length} of {totalCourses} courses
                                </Typography>
                            </div>

                            <div className="flex items-center gap-4">
                                <FormControl variant="outlined" size="small">
                                    <InputLabel id="page-size-label">Per Page</InputLabel>
                                    <Select
                                        labelId="page-size-label"
                                        value={size}
                                        onChange={handleChangeSize}
                                        label="Per Page"
                                    >
                                        <MenuItem value={6}>6</MenuItem>
                                        <MenuItem value={12}>12</MenuItem>
                                        <MenuItem value={24}>24</MenuItem>
                                    </Select>
                                </FormControl>

                                <Pagination
                                    count={totalPages}
                                    page={page + 1} // Convert 0-indexed to 1-indexed
                                    onChange={handleChangePage}
                                    color="primary"
                                    showFirstButton
                                    showLastButton
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}