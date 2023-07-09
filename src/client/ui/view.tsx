import { FC, memo }        from "react";
import { useGetState }     from "../index";
import { ElementInstance } from "./element-instance";
import { useSnapshot } from "valtio";

export const ElementSimpleTransform: FC<{ id: string }> = memo(({ id }) => {
  const {activeScene} = useSnapshot(window.ApiClient.scenes.state);
  const rect = useGetState(state => state.elements[id].scenes[activeScene]?.rect);
  return <div
    className="absolute transition-all duration-100"
    style={{
      width: rect?.w || 0,
      height: rect?.h || 0,
      left: rect?.x || 0,
      top: rect?.y || 0,
    }}
  >
    <ElementInstance id={id} />
  </div>
});

const View: FC = () => {
  const canvas = useGetState(state => state.canvas);
  const ids = useGetState(state => state.elementsIds);
  return <div className="overflow-hidden w-screen h-screen flex items-center justify-center">
    <div style={{ width: canvas?.w, height: canvas?.h }} className="relative">
      {ids?.map((elementId) => <ElementSimpleTransform id={elementId} key={elementId} />)}
    </div>
  </div>
}

export default View;
