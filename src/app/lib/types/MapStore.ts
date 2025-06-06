import { ViewState } from "react-map-gl";

export type LayersVisibility = {
  "zonages-zqfs-source": boolean;
  "protected-areas-source": {
    ENS: boolean;
    RNR: boolean;
    RNN: boolean;
  };
  "swiss-protected-areas-source": boolean;
  "other-appb-source": boolean;
  "authorized-paths-source": boolean;
  "recommended-paths-source": boolean;
};

export interface MapStoreState {
  viewState: ViewState;
  layersVisibility: LayersVisibility;
  actions: {
    setViewState(viewState: ViewState): void;
    toggleLayer(layerId: string, subLayerId?: string): void;
  };
}
