import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks
export const fetchWorkspaces = createAsyncThunk(
    "workspace/fetchWorkspaces",
    async () => {
        const response = await fetch("/api/workspaces");
        if (!response.ok) throw new Error("Failed to fetch workspaces");
        return response.json();
    }
);

export const createProjectAsync = createAsyncThunk(
    "workspace/createProject",
    async (projectData: any) => {
        const response = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(projectData),
        });
        if (!response.ok) throw new Error("Failed to create project");
        return response.json();
    }
);

export const createTaskAsync = createAsyncThunk(
    "workspace/createTask",
    async (taskData: any) => {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error("Failed to create task");
        return response.json();
    }
);

export const updateTaskAsync = createAsyncThunk(
    "workspace/updateTask",
    async ({ id, ...data }: any) => {
        const response = await fetch(`/api/tasks/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update task");
        return response.json();
    }
);

export const deleteTaskAsync = createAsyncThunk(
    "workspace/deleteTask",
    async ({ taskId, projectId }: { taskId: string; projectId: string }) => {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete task");
        return { taskId, projectId };
    }
);

export const updateProjectAsync = createAsyncThunk(
    "workspace/updateProject",
    async ({ id, ...data }: any) => {
        const response = await fetch(`/api/projects/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update project");
        return response.json();
    }
);

interface WorkspaceState {
    workspaces: any[];
    currentWorkspace: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: WorkspaceState = {
    workspaces: [],
    currentWorkspace: null,
    loading: false,
    error: null,
};

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        setWorkspaces: (state, action) => {
            state.workspaces = action.payload;
        },
        setCurrentWorkspace: (state, action) => {
            localStorage.setItem("currentWorkspaceId", action.payload);
            state.currentWorkspace = state.workspaces.find((w) => w.id === action.payload) || null;
        },
        addWorkspace: (state, action) => {
            state.workspaces.push(action.payload);
            if (!state.currentWorkspace || state.currentWorkspace?.id !== action.payload.id) {
                state.currentWorkspace = action.payload;
            }
        },
        updateWorkspace: (state, action) => {
            state.workspaces = state.workspaces.map((w) =>
                w.id === action.payload.id ? action.payload : w
            );
            if (state.currentWorkspace?.id === action.payload.id) {
                state.currentWorkspace = action.payload;
            }
        },
        deleteWorkspace: (state, action) => {
            state.workspaces = state.workspaces.filter((w) => w.id !== action.payload);
        },
        addProject: (state, action) => {
            if (state.currentWorkspace) {
                state.currentWorkspace.projects.push(action.payload);
                state.workspaces = state.workspaces.map((w) =>
                    w.id === state.currentWorkspace?.id
                        ? { ...w, projects: [...w.projects, action.payload] }
                        : w
                );
            }
        },
        addTask: (state, action) => {
            if (state.currentWorkspace) {
                state.currentWorkspace.projects = state.currentWorkspace.projects.map((p: any) => {
                    if (p.id === action.payload.projectId) {
                        return { ...p, tasks: [...p.tasks, action.payload] };
                    }
                    return p;
                });
                state.workspaces = state.workspaces.map((w) =>
                    w.id === state.currentWorkspace?.id
                        ? {
                            ...w,
                            projects: w.projects.map((p: any) =>
                                p.id === action.payload.projectId
                                    ? { ...p, tasks: [...p.tasks, action.payload] }
                                    : p
                            ),
                        }
                        : w
                );
            }
        },
        updateTask: (state, action) => {
            if (state.currentWorkspace) {
                state.currentWorkspace.projects = state.currentWorkspace.projects.map((p: any) => {
                    if (p.id === action.payload.projectId) {
                        return {
                            ...p,
                            tasks: p.tasks.map((t: any) =>
                                t.id === action.payload.id ? action.payload : t
                            ),
                        };
                    }
                    return p;
                });
                state.workspaces = state.workspaces.map((w) =>
                    w.id === state.currentWorkspace?.id
                        ? {
                            ...w,
                            projects: w.projects.map((p: any) =>
                                p.id === action.payload.projectId
                                    ? {
                                        ...p,
                                        tasks: p.tasks.map((t: any) =>
                                            t.id === action.payload.id ? action.payload : t
                                        ),
                                    }
                                    : p
                            ),
                        }
                        : w
                );
            }
        },
        deleteTask: (state, action) => {
            const { taskId, projectId } = action.payload;
            if (state.currentWorkspace) {
                state.currentWorkspace.projects = state.currentWorkspace.projects.map((p: any) => {
                    if (p.id === projectId) {
                        return { ...p, tasks: p.tasks.filter((t: any) => t.id !== taskId) };
                    }
                    return p;
                });
                state.workspaces = state.workspaces.map((w) =>
                    w.id === state.currentWorkspace?.id
                        ? {
                            ...w,
                            projects: w.projects.map((p: any) =>
                                p.id === projectId
                                    ? { ...p, tasks: p.tasks.filter((t: any) => t.id !== taskId) }
                                    : p
                            ),
                        }
                        : w
                );
            }
        },
        updateProject: (state, action) => {
            if (state.currentWorkspace) {
                state.currentWorkspace.projects = state.currentWorkspace.projects.map((p: any) =>
                    p.id === action.payload.id ? { ...p, ...action.payload } : p
                );
                state.workspaces = state.workspaces.map((w) =>
                    w.id === state.currentWorkspace?.id
                        ? {
                            ...w,
                            projects: w.projects.map((p: any) =>
                                p.id === action.payload.id ? { ...p, ...action.payload } : p
                            ),
                        }
                        : w
                );
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch workspaces
            .addCase(fetchWorkspaces.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkspaces.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = action.payload;
                // Set current workspace from localStorage or use first one
                const savedId = typeof window !== 'undefined' ? localStorage.getItem("currentWorkspaceId") : null;
                state.currentWorkspace = action.payload.find((w: any) => w.id === savedId) || action.payload[0] || null;
            })
            .addCase(fetchWorkspaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch workspaces";
            })
            // Create project
            .addCase(createProjectAsync.fulfilled, (state, action) => {
                if (state.currentWorkspace) {
                    state.currentWorkspace.projects.push(action.payload);
                    state.workspaces = state.workspaces.map((w) =>
                        w.id === state.currentWorkspace?.id
                            ? { ...w, projects: [...w.projects, action.payload] }
                            : w
                    );
                }
            })
            // Create task
            .addCase(createTaskAsync.fulfilled, (state, action) => {
                if (state.currentWorkspace) {
                    state.currentWorkspace.projects = state.currentWorkspace.projects.map((p: any) => {
                        if (p.id === action.payload.projectId) {
                            return { ...p, tasks: [...p.tasks, action.payload] };
                        }
                        return p;
                    });
                }
            })
            // Update task
            .addCase(updateTaskAsync.fulfilled, (state, action) => {
                if (state.currentWorkspace) {
                    state.currentWorkspace.projects = state.currentWorkspace.projects.map((p: any) => {
                        if (p.id === action.payload.projectId) {
                            return {
                                ...p,
                                tasks: p.tasks.map((t: any) =>
                                    t.id === action.payload.id ? action.payload : t
                                ),
                            };
                        }
                        return p;
                    });
                }
            })
            // Delete task
            .addCase(deleteTaskAsync.fulfilled, (state, action) => {
                const { taskId, projectId } = action.payload;
                if (state.currentWorkspace) {
                    state.currentWorkspace.projects = state.currentWorkspace.projects.map((p: any) => {
                        if (p.id === projectId) {
                            return { ...p, tasks: p.tasks.filter((t: any) => t.id !== taskId) };
                        }
                        return p;
                    });
                }
            })
            // Update project
            .addCase(updateProjectAsync.fulfilled, (state, action) => {
                if (state.currentWorkspace) {
                    state.currentWorkspace.projects = state.currentWorkspace.projects.map((p: any) =>
                        p.id === action.payload.id ? { ...p, ...action.payload } : p
                    );
                }
            });
    },
});

export const {
    setWorkspaces,
    setCurrentWorkspace,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addProject,
    addTask,
    updateTask,
    deleteTask,
    updateProject,
} = workspaceSlice.actions;
export default workspaceSlice.reducer;