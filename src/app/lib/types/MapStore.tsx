import { ViewState } from "react-map-gl";

export interface MapStoreState {
    viewState: ViewState;
    actions: {
      setViewState(viewState: ViewState): void;
    };
  }