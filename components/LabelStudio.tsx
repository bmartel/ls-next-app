import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react"
import '@heartexlabs/label-studio/build/static/css/main.css';

const Context = createContext([] as any)

type LabelStudioInterface =
  "panel" |
  "update" |
  "submit" |
  "controls" |
  "side-column" |
  "annotations:menu" |
  "annotations:add-new" |
  "annotations:delete" |
  "predictions:menu"

type LabellingConfig = string

type LabelStudioUser = Record<string, any>
type LabelStudioTaskData = Record<string, any>
type LabelStudioAnnotation = unknown
type LabelStudioPrediction = unknown

interface LabelStudioTask {
  id: number;
  annotations: LabelStudioAnnotation[];
  predictions: LabelStudioPrediction[];
  data: LabelStudioTaskData;
}

interface LabelStudioConfig {
  config: LabellingConfig;// Labelling config, XML-like DSL.
  interfaces: LabelStudioInterface[];
  user: LabelStudioUser;
  task: LabelStudioTask;
  onLabelStudioLoad: (instance: any) => void;
}

export const useLabelStudio = () => useContext(Context);

let resolved: any = null;

const loadLabelStudio = async () => {
  if (resolved) return resolved;

  // @ts-ignore
  window.APP_SETTINGS = window.APP_SETTINGS || {};
  // @ts-ignore
  window.APP_SETTINGS.feature_flags_default_value = true;

  // @ts-ignore
  await import("@heartexlabs/label-studio");

  // @ts-ignore
  resolved = window.LabelStudio;

  return resolved;
}

const createLabelStudio = async (config: LabelStudioConfig, root = "label-studio") => {
  const LabelStudio = await loadLabelStudio();

  return new LabelStudio(root, config);
}

const useLabelStudioContext = (config?: LabelStudioConfig) => {
  const instance = useRef<any>();
  const [,update] = useState<any>();

  const updateConfig = useCallback(async (config: LabelStudioConfig) => {

    instance.current = await createLabelStudio(config);

    update({});
  }, []);

  useEffect(() => {
    if (config) {
      updateConfig(config);
    }
    return () => {
      try {
        instance.current?.destroy();
      } catch { }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return [instance.current, updateConfig] as const;
}

const LabelStudioProvider = ({ children }: any) => {
  const labelstudio = useLabelStudioContext()

  return (
    <Context.Provider value={labelstudio}>
      <div id="label-studio" />
      {children}
    </Context.Provider>
  )
}

export default LabelStudioProvider;
