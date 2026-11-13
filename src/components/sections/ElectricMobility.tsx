import { ElectricChapters } from "./ElectricChapters";
import { TripVsRange } from "./TripVsRange";

/** 05 — Electric mobility: pinned chapters, then the Trip-against-range interaction. */
export function ElectricMobility({ standalone = false }: { standalone?: boolean }) {
  return (
    <>
      <ElectricChapters standalone={standalone} />
      <TripVsRange />
    </>
  );
}
