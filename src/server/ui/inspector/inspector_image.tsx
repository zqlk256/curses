import { useGetState, useUpdateState } from "@/client";
import { Element_ImageState } from "@/client/elements/image/schema";
import { useInspectorTabs } from "@/server/ui/inspector/components/tabs";
import { FC, useMemo } from "react";
import { RiImageFill, RiImageLine } from "react-icons/ri";
import { SiCsswizardry } from "react-icons/si";
import { useSnapshot } from "valtio";
import Inspector from "./components";
import { InputCode, InputEvent, InputFile, InputText } from "./components/input";
import NameInput from "./components/name-input";
import TransformInput from "./components/transform-input";
import { useUpdateElement } from "@/utils";

const BaseInspector: FC<{ id: string }> = ({ id }) => {
  const {activeScene} = useSnapshot(window.ApiClient.scenes.state);
  const data: Element_ImageState = useGetState(state => state.elements[id].scenes[activeScene].data as Element_ImageState);
  const up = useUpdateElement<Element_ImageState>(id);

  return <>
    <Inspector.SubHeader>Base style</Inspector.SubHeader>
    <InputFile type="image" value={data.fileId} onChange={id => up("fileId", id)} label="File" />
    <InputText type="number" value={data.styleOpacity} onChange={e => up("styleOpacity", e.target.value)} label="Opacity" />

    <Inspector.SubHeader>Active style</Inspector.SubHeader>
    <InputFile type="image" value={data.activeFileId} onChange={id => up("activeFileId", id)} label="File" />
    <InputText type="number" value={data.activeStyleOpacity} onChange={e => up("activeStyleOpacity", e.target.value)} label="Opacity" />
    <InputText type="number" min={0} value={data.activeDuration} onChange={e => up("activeDuration", parseFloat(e.target.value) || 0)} label="Duration" />
    <InputText type="number" min={0} value={data.activeTransitionDuration} onChange={e => up("activeTransitionDuration", e.target.value)} label="Transition duration" />
    <InputEvent value={data.activeEvent} onChange={event => up("activeEvent", event)} label="Activate on" />
    <Inspector.Description>For text element to work, enable "Emit event" in its behaviour tab</Inspector.Description>
  </>
}

const CssInspector: FC<{ id: string }> = ({ id }) => {
  const {activeScene} = useSnapshot(window.ApiClient.scenes.state);
  const data: Element_ImageState = useGetState(state => state.elements[id].scenes[activeScene].data as Element_ImageState);
  const up = useUpdateElement<Element_ImageState>(id);
  return <>
    <Inspector.SubHeader>CSS style</Inspector.SubHeader>
    <InputCode language="css" label="CSS" value={data.styleCss} onChange={e => up("styleCss", e || "")} />
  </>
}

const Inspector_ElementImage: FC<{ id: string }> = ({ id }) => {
  const {activeScene} = useSnapshot(window.ApiClient.scenes.state);
  const [[tab, direction], handleTab] = useInspectorTabs();
  const data = useGetState(state => state.elements[id]?.scenes);
  const isInScene = useMemo(() => data && activeScene in data, [activeScene, data]);

  if (!data)
    return <Inspector.Deleted/>

  return <Inspector.Body>
    <Inspector.Header><RiImageFill /> <NameInput id={id} /></Inspector.Header>
    {isInScene && <Inspector.Content>
      <TransformInput id={id} />
      <Inspector.Tabs>
        <Inspector.Tab tooltip="Base style" tooltipBody="Image Properties" onClick={() => handleTab(0)} active={tab === 0}><RiImageLine /></Inspector.Tab>
        <Inspector.Tab tooltip="CSS" onClick={() => handleTab(1)} active={tab === 1}><SiCsswizardry /></Inspector.Tab>
      </Inspector.Tabs>
      <Inspector.TabsContent direction={direction} tabKey={tab}>
        {tab === 0 && <BaseInspector id={id} />}
        {tab === 1 && <CssInspector id={id} />}
      </Inspector.TabsContent>
    </Inspector.Content>}
    {!isInScene && <Inspector.Content>
      <Inspector.AddToScene id={id} />
    </Inspector.Content>}
  </Inspector.Body>
}

export default Inspector_ElementImage;
