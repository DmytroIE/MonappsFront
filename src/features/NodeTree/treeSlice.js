import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getNodes, getNodeData, getNodeReadings } from '../../services/api';
// import { stat } from 'fs';


// thunks
export const fetchNodes = createAsyncThunk(
  'tree/fetchNodes',
  async () => {
    const nodes = await getNodes();
    return nodes;
  }
)

export const fetchNodeData = createAsyncThunk(
  'tree/fetchNodeData',
  async (arg) => {
    const { id } = arg;
    const data = await getNodeData(id);
    return data;
  }
)

export const fetchNodeReadings = createAsyncThunk(
  'tree/fetchNodeReadings',
  async (arg) => {
    const { items } = arg;
    const readings = await getNodeReadings(items);
    return readings;
  }
)


// slice
const initialState = {
  selNodeId: null,
  selNodeReadings: [],
  nodes: {},
  treeLoadingState: 'idle',
  nodeDataLoadingState: 'idle',
  selNodeReadingsLoadingState: 'idle',
};

export const treeSlice = createSlice({
  name: 'tree',
  initialState,
  reducers: {
    selectNode: (state, action) => {
      state.selNodeId = action.payload
    },
    updateNode: (state, action) => {
      const id = action.payload.id
      const node = state.nodes[id]
      if (node !== undefined) {
        state.nodes[id] = { ...node, ...action.payload };
      }
      // console.log(`${id} updated by an MQTT message`)
    },
    addNode: (state, action) => {
      state.nodes[action.payload.id] = action.payload;
    },
    deleteNode: (state, action) => {
      delete state.nodes[action.payload.id];
    },
    clearSelNodeReadings: (state, action) => {
      state.selNodeReadings = [];
    }
  },
  extraReducers: (builder) => {

    // Tree nodes
    builder.addCase(fetchNodes.pending, (state, action) => {
      state.treeLoadingState = 'pending';
    });
    builder.addCase(fetchNodes.fulfilled, (state, action) => {
      state.treeLoadingState = 'idle';
      // enrichNodesWithChildrenIds(action.payload);
      state.nodes = action.payload;
    });
    builder.addCase(fetchNodes.rejected, (state, action) => {
      state.treeLoadingState = 'idle';
      state.nodes = {};
    });

    // Ind node data - used when some updates via MQTT were published
    builder.addCase(fetchNodeData.pending, (state, action) => {
      state.nodeDataLoadingState = 'pending';
    });
    builder.addCase(fetchNodeData.fulfilled, (state, action) => {
      state.nodeDataLoadingState = 'idle';
      state.nodes = { ...state.nodes, [action.payload.id]: action.payload };
    });
    builder.addCase(fetchNodeData.rejected, (state, action) => {
      state.nodeDataLoadingState = 'idle';
    });

    // Readings - df, ds - for datastreams, datafeeds and applications
    builder.addCase(fetchNodeReadings.pending, (state, action) => {
      state.selNodeReadingsLoadingState = 'pending';
    });
    builder.addCase(fetchNodeReadings.fulfilled, (state, action) => {
      state.selNodeReadingsLoadingState = 'idle';
      state.selNodeReadings = action.payload

    });
    builder.addCase(fetchNodeReadings.rejected, (state, action) => {
      state.selNodeReadingsLoadingState = 'idle';
      state.selNodeReadings = []
    });
  },
})

// Action creators are generated for each case reducer function
export const { selectNode, updateNode, clearSelNodeReadings, addNode, deleteNode } = treeSlice.actions;
export default treeSlice.reducer;