import workspaceReducer, {
    setWorkspaces,
    setCurrentWorkspace,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    fetchWorkspaces,
    createProjectAsync
} from './workspaceSlice';

// Helper to mock fetch
global.fetch = jest.fn();

describe('workspaceSlice', () => {
    const initialState = {
        workspaces: [],
        currentWorkspace: null,
        loading: false,
        error: null,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle initial state', () => {
        expect(workspaceReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle setWorkspaces', () => {
        const workspaces = [{ id: '1', name: 'Work 1' }];
        const actual = workspaceReducer(initialState, setWorkspaces(workspaces));
        expect(actual.workspaces).toEqual(workspaces);
    });

    it('should handle addWorkspace', () => {
        const newWorkspace = { id: '1', name: 'New Work' };
        const actual = workspaceReducer(initialState, addWorkspace(newWorkspace));
        expect(actual.workspaces).toHaveLength(1);
        expect(actual.workspaces[0]).toEqual(newWorkspace);
        expect(actual.currentWorkspace).toEqual(newWorkspace);
    });

    it('should handle fetchWorkspaces.pending', () => {
        const action = { type: fetchWorkspaces.pending.type };
        const state = workspaceReducer(initialState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should handle fetchWorkspaces.fulfilled', () => {
        const workspaces = [{ id: '1', name: 'Work 1' }];
        const action = { type: fetchWorkspaces.fulfilled.type, payload: workspaces };
        const state = workspaceReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.workspaces).toEqual(workspaces);
        expect(state.currentWorkspace).toEqual(workspaces[0]);
    });

    it('should handle fetchWorkspaces.rejected', () => {
        const action = { type: fetchWorkspaces.rejected.type, error: { message: 'Failed' } };
        const state = workspaceReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toEqual('Failed');
    });
});
