import { useLabelStudio } from "@/components/LabelStudio"
import { Sidebar } from "@/components/Sidebar";

export default function Home() {
  const labelstudio = useLabelStudio()

  if (!labelstudio) {
    return null;
  }

  return (
    <Sidebar>
      <p>Hello from the sidebar</p>
    </Sidebar>
  )
}
