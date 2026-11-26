import PageHeader from "@/components/admin/PageHeader";
import LocationForm from "@/components/admin/LocationForm";

export default function NewLocation() {
  return (
    <>
      <PageHeader title="Add location" subtitle="New areas appear on the map and get their own property page." />
      <LocationForm location={null} />
    </>
  );
}
