import type { ProjectInfo } from "@/lib/const/projects";

type Props = Pick<ProjectInfo, "image" | "video" | "id" | "name"> & {
  class?: string;
};

export default function ProjectMedia({
  image,
  video,
  id,
  name,
  class: className,
}: Props) {
  if (image)
    return (
      <img id={id} src={image} alt={`Preview of ${name}`} class={className} />
    );
  if (video)
    return <video id={id} src={video} autoplay muted loop class={className} />;
  return <></>;
}
