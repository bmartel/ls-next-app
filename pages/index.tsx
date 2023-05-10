import { useLabelStudio } from "@/components/LabelStudio"
import { Sidebar } from "@/components/Sidebar";
import { useEffect } from "react";

const config = {
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
    const c = instance.annotationStore.addAnnotation({
      userGenerate: true
    });
    instance.annotationStore.selectAnnotation(c.id);
  }
} 

export default function Home() {
  const [labelstudio, updateConfig] = useLabelStudio()

  useEffect(() => {
    if (!labelstudio) {
      updateConfig(config)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!labelstudio) {
    return null;
  }

  return (
    <Sidebar>
      <p>Hello from the sidebar</p>
    </Sidebar>
  )
}
