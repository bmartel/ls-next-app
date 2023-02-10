import { createContext, useContext, useState, useEffect, useMemo } from "react"
import '@martel/label-studio/build/static/css/main.css';

const Context = createContext(null)

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

export const useLabelStudio = () => useContext(Context)

let resolved: any = null

const loadLabelStudio = async (config: LabelStudioConfig) => {
  if (resolved) return resolved;

  // @ts-ignore
  window.APP_SETTINGS = window.APP_SETTINGS || {}
  // @ts-ignore
  window.APP_SETTINGS.feature_flags_default_value = true;

  // @ts-ignore
  await import("@martel/label-studio");

  const LabelStudio = window.LabelStudio

  resolved = new LabelStudio('label-studio', config);

  return resolved
}

const useLabelStudioConfig = (config: LabelStudioConfig) => {
  const [instance, update] = useState<any>()

  useEffect(() => {
    let ls: any;

    loadLabelStudio(config).then((_ls: any) => {
      ls = _ls
      update(ls)
    })

    return () => {
      try {
        ls?.destroy()
      } catch { }
    }
  }, [config])

  return instance;
}

export default ({ children }: any) => {
  const config = useMemo<LabelStudioConfig>(() => ({
    config: `
      <View>
        <Header value="Select regions:"></Header>
        <Labels name="label" toName="audio" choice="multiple">
          <Label value="Beat" background="yellow"></Label>
          <Label value="Voice" background="red"></Label>
          <Label value="Guitar" background="blue"></Label>
          <Label value="Other"></Label>
        </Labels>
        <Header value="Select genre:"></Header>
        <Choices name="choice" toName="audio" choice="multiple">
          <Choice value="Lo-Fi" />
          <Choice value="Rock" />
          <Choice value="Pop" />
        </Choices>
        <Header value="Listen the audio:"></Header>
        <AudioPlus name="audio" value="$audio"></AudioPlus>
      </View>
    `,

    interfaces: [
      "panel",
      "update",
      "submit",
      "controls",
      "side-column",
      "annotations:menu",
      "annotations:add-new",
      "annotations:delete",
      "predictions:menu",
    ],

    user: {
      pk: 1,
      id: 1,
      firstName: "James",
      lastName: "Dean"
    },

    task: {
      annotations: [
        {
          id: "abc",
          result: [
            {
              from_name: 'choice',
              id: 'hIj6zg57SY',
              to_name: 'audio',
              type: 'choices',
              origin: 'manual',
              value: {
                choices: ['Lo-Fi'],
              },
            },
            {
              from_name: 'label',
              id: 'SsGrpVgy_C',
              to_name: 'audio',
              original_length: 98.719925,
              type: 'labels',
              origin: 'manual',
              value: {
                channel: 0,
                end: 28.50568583621215,
                labels: ['Beat'],
                start: 12.778410892095105,
              },
            },
            {
              from_name: 'label',
              id: 'JhxupEJWlW',
              to_name: 'audio',
              original_length: 98.719925,
              type: 'labels',
              origin: 'manual',
              value: {
                channel: 1,
                end: 59.39854733358493,
                labels: ['Other'],
                start: 55.747572792986325,
              },
            },
          ]
        }
      ],
      id: 1,
      data: {
        audio: 'https://htx-misc.s3.amazonaws.com/opensource/label-studio/examples/audio/barradeen-emotional.mp3',
      },
      predictions: []
    },

    onLabelStudioLoad: function(instance: any) {
      console.log(instance)
      const c = instance.annotationStore.addAnnotation({
        userGenerate: true
      });
      instance.annotationStore.selectAnnotation(c.id);
    }
  }), [])
  const labelstudio = useLabelStudioConfig(config)

  return (
    <Context.Provider value={labelstudio}>
      <div id="label-studio" />
      {children}
    </Context.Provider>
  )
}
