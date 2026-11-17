import HomeClient from "./HomeClient";
import { getSheetEvents } from "./sheets";

export const revalidate = 60;

export default async function HomePage() {
  const { events } = await getSheetEvents();
  return <HomeClient initialEvents={events} />;
}
