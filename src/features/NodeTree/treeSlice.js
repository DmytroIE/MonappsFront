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
    const { id, readingType, gt, gte, lte } = arg;
    const readings = await getNodeReadings(id, readingType, gt, gte, lte);
    return readings;
  }
)


// slice
const initialState = {
  selNodeId: null,
  selNodeReadings: {},
  selNodeRawReadings: {},
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
      state.selNodeReadings = {};
      state.selNodeRawReadings = {};
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

      // console.log("fetchNodeReadings.fulfilled");
      // console.log(action.payload);
      const itemId = action.payload.id;
      const readingType = action.payload.readingType;
      const readingMap = {};

      if (action.payload.batch.length === 0) {
        return;
      }

      for (let reading of action.payload.batch) {
        readingMap[reading.t] = reading;
      }

      if (state.selNodeRawReadings[itemId] === undefined) {
        state.selNodeRawReadings[itemId] = {};
        state.selNodeRawReadings[itemId][readingType] = readingMap;
      }
      else {
        const updatedReadings = { ...state.selNodeRawReadings[itemId][readingType], ...readingMap };
        state.selNodeRawReadings[itemId][readingType] = updatedReadings;
      }

      //
      if (action.payload.batch.at(-1).t === action.payload.lastReadingTs) {
          state.selNodeReadingsLoadingState = 'success';
          if (state.selNodeReadings[itemId] === undefined) {
            state.selNodeReadings[itemId] = {};
          }
          state.selNodeReadings[itemId][readingType] = state.selNodeRawReadings[itemId][readingType];
      }
      
      // here should be resampling
      // if (state.selNodeReadings[itemId] === undefined) {
      //   state.selNodeReadings[itemId] = {};
      //   state.selNodeReadings[itemId][readingType] = readingMap;
      // }
      // else {
      //   const updatedReadings = { ...state.selNodeReadings[itemId][readingType], ...readingMap };
      //   state.selNodeReadings[itemId][readingType] = updatedReadings;
      // }

    });
    builder.addCase(fetchNodeReadings.rejected, (state, action) => {
      state.selNodeReadingsLoadingState = 'error';
      state.selNodeReadings = {}
    });
  },
})

// Action creators are generated for each case reducer function
export const { selectNode, updateNode, clearSelNodeReadings, addNode, deleteNode } = treeSlice.actions;
export default treeSlice.reducer;