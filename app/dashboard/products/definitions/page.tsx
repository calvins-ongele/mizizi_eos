import OverlayScrollbarsInit from "@/app/components/customscrollbar";
import { 
  BootstrapBundle, 
  CustomMin, 
  JqueryMin, 
  MomentMin, 
} from "@/app/components/JsClients";
import DefinitionsClient from "./DefinitionsClient";

export default async function AddCategory() {
  return (
    <div className="container-fluid px-3 pt-2 ">
      <div className="card mb-2">
        <div className="card-header d-flex justify-content-center align-items-center">
          <h4 className="mb-2  ">Manage Product Definitions</h4>
        </div>
      </div>
      <DefinitionsClient />
      <JqueryMin />
      <BootstrapBundle />
      <MomentMin />
      <OverlayScrollbarsInit /> 
      <CustomMin />
    </div>
  );
}
