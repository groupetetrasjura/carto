import { StateCreator, create } from "zustand";
import { LayersVisibility, MapStoreState } from "@/lib/types/MapStore";
import { ViewState } from "react-map-gl";

export const initialMapStoreState = {
  viewState: {
    latitude: 46.543026,
    longitude: 6.019153,
    zoom: 11,
    bearing: 0,
    pitch: 0,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  } as ViewState,
  layersVisibility: {
    "zonages-zqfs-source": false,
    "protected-areas-source": {
      ENS: false,
      RNR: false,
      RNN: false,
    },
    "swiss-protected-areas-source": false,
    "other-appb-source": false,
    "authorized-paths-source": false,
    "recommended-paths-source": false,
  } as LayersVisibility,
};

export const stateCreator: StateCreator<MapStoreState> = (set) => ({
  ...initialMapStoreState,
  actions: {
    setViewState: (viewState?: ViewState) => {
      set((state) => ({
        ...state,
        viewState,
      }));
    },
    toggleLayer: (
      layerId: keyof LayersVisibility,
      subLayerId?: keyof LayersVisibility["protected-areas-source"]
    ) => {
      set((state) => {
        const updatedVisibility = { ...state.layersVisibility };

        if (layerId === "protected-areas-source" && subLayerId) {
          const currentLayerVisibility = updatedVisibility[
            layerId
          ] as LayersVisibility["protected-areas-source"];
          updatedVisibility[layerId] = {
            ...currentLayerVisibility,
            [subLayerId]: !currentLayerVisibility[subLayerId], // Toggle the specific sub-layer
          };
        } else if (
          layerId === "authorized-paths-source" ||
          layerId === "recommended-paths-source"
        ) {
          const current = updatedVisibility[layerId] as boolean;
          updatedVisibility[layerId] = !current;

          // exclusivity: disables the other if this one is activated
          if (!current) {
            const other =
              layerId === "authorized-paths-source"
                ? "recommended-paths-source"
                : "authorized-paths-source";
            updatedVisibility[other] = false;
          }
        } else if (
          layerId in updatedVisibility &&
          layerId !== "protected-areas-source"
        ) {
          // Toggle a normal layer (that is not protected areas)
          updatedVisibility[layerId] = !updatedVisibility[layerId] as boolean;
        }

        return { layersVisibility: updatedVisibility };
      });
    },
    setLayerVisibility: (
      layerId: "authorized-paths-source" | "recommended-paths-source"
    ) => {
      set((state) => {
        const updatedVisibility = {
          ...state.layersVisibility,
          "authorized-paths-source": layerId === "authorized-paths-source",
          "recommended-paths-source": layerId === "recommended-paths-source",
        };

        return { layersVisibility: updatedVisibility };
      });
    },
  },
});

export const useMapStore = create<MapStoreState>()(stateCreator);

// GETTERS

export const useViewState = () => useMapStore((state) => state.viewState);
export const useLayersVisibility = () =>
  useMapStore((state) => state.layersVisibility);

// 🎉 one selector for all our actions
export const useMapStoreActions = () => useMapStore((state) => state.actions);
