import OverlayScrollbarsInit from "@/app/components/customscrollbar";
import { 
  BootstrapBundle, 
  CustomMin, 
  JqueryMin, 
  MomentMin, 
} from "@/app/components/JsClients";
import LabelsClient from "./LabelsClient";

export default async function AddCategory() {
  return (
    <div className="container-fluid px-3 pt-2 ">
      <div className="card mb-2">
        <div className="card-header d-flex justify-content-center align-items-center">
          <h4 className="mb-2  ">Manage Product Units</h4>
        </div>
      </div>
      <LabelsClient />
      <JqueryMin />
      <BootstrapBundle />
      <MomentMin />
      <OverlayScrollbarsInit /> 
      <CustomMin />
    </div>
  );
}
