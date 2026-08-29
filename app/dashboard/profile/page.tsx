import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { EditProfileForm } from "./EditProfileForm";
import { EditCompany } from "./EditCompany";
import { getCompany } from "@/app/lib/getCompany"; 
import {
  BootstrapBundle,
  CustomMin, 
  JqueryMin,
  MomentMin,
  OverlayMin,
} from "@/app/components/JsClients";
import OverlayScrollbarsInit from "@/app/components/customscrollbar";
import RequestDeletion from "./requestdeletion";
import PasswordReset from "./PasswordReset";
import Subscribe from "./Subscribe";
import SubscriptionHistory from "./SubscriptionHistory";
import BalanceAndWithdrawal from "./BalanceAndWithdrawal";

const company = await getCompany();  

export const metadata = { title: `Profile | ${company.name}` };

export default async function ProfilePage() {
  const user = await getCurrentUser();

  


  if (!user) return <p>Unauthorized</p>;

  return (
    <div className="space-y-6"> 

      {/* <div classNameName="border rounded p-4 space-y-3">
        <EditProfileForm user={user} />
      </div> */}

      {/* <!-- App hero header starts --> */}
          <div className="app-hero-header d-flex align-items-center">

            {/* <!-- Breadcrumb starts --> */}
            <div className="d-flex align-items-center">
              <div className="me-3 icon-box md border bg-white rounded-5">
                <i className="bi bi-gear fs-5 text-primary"></i>
              </div>
              <div>
                <h2 className="m-0">Settings</h2>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                    <li className="breadcrumb-item">Pages</li>
                    <li className="breadcrumb-item active" aria-current="page">Account Settings</li>
                  </ol>
                </nav>
              </div>
            </div>
            {/* <!-- Breadcrumb ends -->

            <!-- Sales stats starts --> */}
            <div className="ms-auto d-lg-flex d-none flex-row">
              <div className="d-flex flex-row gap-1">
                <a href="#" className="icon-box icon-btn rounded-5 grd-primary" data-bs-toggle="tooltip"
                  data-bs-placement="bottom" title="Share">
                  <i className="bi bi-share"></i>
                </a>
                <a href="#" className="icon-box icon-btn rounded-5 grd-primary" data-bs-toggle="tooltip"
                  data-bs-placement="bottom" title="Print">
                  <i className="bi bi-printer"></i>
                </a>
                <a href="#" className="icon-box icon-btn rounded-5 grd-primary" id="downloadDataToast"
                  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Download">
                  <i className="bi bi-download"></i>
                </a>
              </div>
            </div>
            {/* <!-- Sales stats ends --> */}

          </div>
          {/* <!-- App Hero header ends -->

          <!-- App body starts --> */}
          <div className="app-body">

            {/* <!-- Row start --> */}
            <div className="row gx-4">
              <div className="col-sm-12">
                <div className="card mb-4">
                  <div className="card-body">

                    {/* <!-- Tabs starts --> */}
                    <ul className="nav nav-pills mb-3 gap-1" id="pills-tab" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button className="nav-link rounded-pill active " id="pills-0-tab" data-bs-toggle="pill"
                          data-bs-target="#pills-0" type="button" role="tab" aria-controls="pills-0"
                          aria-selected="true">General</button>
                      </li>

                      <li className="nav-item" role="presentation">
                        <button className="nav-link rounded-pill " id="pills-a-tab" data-bs-toggle="pill"
                          data-bs-target="#pills-a" type="button" role="tab" aria-controls="pills-a"
                          aria-selected="true">Profile</button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button className="nav-link rounded-pill" id="pills-b-tab" data-bs-toggle="pill"
                          data-bs-target="#pills-b" type="button" role="tab" aria-controls="pills-b"
                          aria-selected="false">Notifications</button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button className="nav-link rounded-pill" id="pills-c-tab" data-bs-toggle="pill"
                          data-bs-target="#pills-c" type="button" role="tab" aria-controls="pills-c"
                          aria-selected="false">Billing</button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button className="nav-link rounded-pill" id="pills-ca-tab" data-bs-toggle="pill"
                          data-bs-target="#pills-ca" type="button" role="tab" aria-controls="pills-ca"
                          aria-selected="false">A/c Balance</button>
                      </li>
                     
                      <li className="nav-item" role="presentation">
                        <button className="nav-link rounded-pill" id="pills-e-tab" data-bs-toggle="pill"
                          data-bs-target="#pills-e" type="button" role="tab" aria-controls="pills-e"
                          aria-selected="false">Password Reset</button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button className="nav-link rounded-pill" id="pills-f-tab" data-bs-toggle="pill"
                          data-bs-target="#pills-f" type="button" role="tab" aria-controls="pills-f"
                          aria-selected="false">Delete Account</button>
                      </li>
                    </ul>
                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-0" role="tabpanel" aria-labelledby="pills-0-tab"
                        tabIndex={0} >

                        {/* <!-- Row start --> */}
                        <div className="row gx-4">
                          <div className="col-xxl-12 col-sm-12">
                            <div className="border rounded-2 p-3 mb-3">

                              {/* <!-- Row start --> */}
                              <div className="row gx-4">
                            
                                <div className="col-xxl-12 col-sm-12">

                                  <div className="mb-4 bg-primary-subtle text-primary p-2 rounded-2">
                                    <h6 className="m-0">Update Organization Details</h6>
                                  </div>

                                  {/* <!-- Row start --> */}
                                  <EditCompany user={user}   />
                                  {/* <!-- Row end --> */}

                                </div>
                              </div>
                              {/* <!-- Row end --> */}

                            </div>
                          </div>
                        </div>
                        {/* <!-- Row end --> */}

                      </div>
                      {/* /////////////////////////////////////////////////////// */}
                      <div className="tab-pane fade " id="pills-a" role="tabpanel" aria-labelledby="pills-a-tab"
                        tabIndex={0} >

                        {/* <!-- Row start --> */}
                        <div className="row gx-4">
                          <div className="col-xxl-9 col-sm-12">
                            <div className="border rounded-2 p-3 mb-3">

                              {/* <!-- Row start --> */}
                              <div className="row gx-4">
                                <div className="col-xxl-3 col-sm-4">
                                  <div className="mb-2">
                                    <img src={user.dp}
                                      className="img-fluid rounded-3 border border-3 border-primary" alt={`${user.name}`}/>
                                  </div>
                                  {/* <button type="button" className="btn btn-primary">Upload New</button>
                                  <div className="form-text">
                                    Max file size 1MB
                                  </div> */}
                                </div>
                                <div className="col-xxl-9 col-sm-8">

                                  <div className="mb-4 bg-primary-subtle text-primary p-2 rounded-2">
                                    <h6 className="m-0">Update Your Details</h6>
                                  </div>

                                  {/* <!-- Row start --> */}
                                  <EditProfileForm user={user} />
                                  {/* <!-- Row end --> */}

                                </div>
                              </div>
                              {/* <!-- Row end --> */}

                            </div>
                          </div>
                        </div>
                        {/* <!-- Row end --> */}

                      </div>
                      <div className="tab-pane fade" id="pills-b" role="tabpanel" aria-labelledby="pills-b-tab"
                        tabIndex={0}>

                        {/* <!-- Row start --> */}
                        <div className="row gx-4">
                          <div className="col-sm-12 col-12">
                            <div className="mb-4 bg-light-subtle p-2 rounded-2">
                              <p className="m-0">While you are not around, check your emails to see what is happening. You
                                can disable these. Update your notifications here.</p>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-sm-6">
                            <div className="list-group">
                              <div className="list-group-item d-flex align-items-center gap-3">
                                <div className="icon-box md bg-primary-subtle rounded-3">
                                  <i className="bi bi-envelope text-primary fs-6"></i>
                                </div>
                                <div>
                                  <h6 className="mb-1">Messages</h6>
                                  <p className="m-0 text-muted">
                                    Messages notifications.
                                  </p>
                                </div>
                                <div className="form-check form-switch m-0 ms-auto">
                                  <input className="form-check-input" type="checkbox" role="switch" id="n2" defaultChecked={false} />
                                </div>
                              </div>
                              <div className="list-group-item d-flex align-items-center gap-3">
                                <div className="icon-box md bg-primary-subtle rounded-3">
                                  <i className="bi bi-star text-primary fs-6"></i>
                                </div>
                                <div>
                                  <h6 className="mb-1">Review</h6>
                                  <p className="m-0 text-muted">
                                    Update review notifications.
                                  </p>
                                </div>
                                <div className="form-check form-switch m-0 ms-auto">
                                  <input className="form-check-input" type="checkbox" role="switch" id="n3" defaultChecked={false}/>
                                </div>
                              </div>
                              <div className="list-group-item d-flex align-items-center gap-3">
                                <div className="icon-box md bg-primary-subtle rounded-3">
                                  <i className="bi bi-broadcast text-primary fs-6"></i>
                                </div>
                                <div>
                                  <h6 className="mb-1">Updates</h6>
                                  <p className="m-0 text-muted">
                                    Updates news notifications.
                                  </p>
                                </div>
                                <div className="form-check form-switch m-0 ms-auto">
                                  <input className="form-check-input" type="checkbox" role="switch" id="n4" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-sm-6">
                            <div className="list-group">
                              <div className="list-group-item d-flex align-items-center gap-3">
                                <div className="icon-box md bg-primary-subtle rounded-3">
                                  <i className="bi bi-display text-primary fs-6"></i>
                                </div>
                                <div>
                                  <h6 className="mb-1">Desktop Notifications</h6>
                                  <p className="m-0 text-muted">
                                    Enable desktop notifications.
                                  </p>
                                </div>
                                <div className="form-check form-switch m-0 ms-auto">
                                  <input className="form-check-input" type="checkbox" role="switch" id="n5" />
                                </div>
                              </div>
                              <div className="list-group-item d-flex align-items-center gap-3">
                                <div className="icon-box md bg-primary-subtle rounded-3">
                                  <i className="bi bi-envelope-paper text-primary fs-6"></i>
                                </div>
                                <div>
                                  <h6 className="mb-1">Email</h6>
                                  <p className="m-0 text-muted">
                                    Enable email notifications.
                                  </p>
                                </div>
                                <div className="form-check form-switch m-0 ms-auto">
                                  <input className="form-check-input" type="checkbox" role="switch" id="n6" defaultChecked={false} />
                                </div>
                              </div>
                              <div className="list-group-item d-flex align-items-center gap-3">
                                <div className="icon-box md bg-primary-subtle rounded-3">
                                  <i className="bi bi-chat-dots text-primary fs-6"></i>
                                </div>
                                <div>
                                  <h6 className="mb-1">Chat</h6>
                                  <p className="m-0 text-muted">
                                    Enable chat notifications.
                                  </p>
                                </div>
                                <div className="form-check form-switch m-0 ms-auto">
                                  <input className="form-check-input" type="checkbox" role="switch" id="n7" defaultChecked={false} />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-sm-6">
                            <div className="list-group">
                              <div className="list-group-item d-flex align-items-center gap-3">
                                <div className="icon-box md bg-primary-subtle rounded-3">
                                  <i className="bi bi-person-plus text-primary fs-6"></i>
                                </div>
                                <div>
                                  <h6 className="mb-1">Follower</h6>
                                  <p className="m-0 text-muted">
                                    Enable or disable followers.
                                  </p>
                                </div>
                                <div className="form-check form-switch m-0 ms-auto">
                                  <input className="form-check-input" type="checkbox" role="switch" id="n8" defaultChecked={false} />
                                </div>
                              </div>
                              <div className="list-group-item d-flex align-items-center gap-3">
                                <div className="icon-box md bg-primary-subtle rounded-3">
                                  <i className="bi bi-clock text-primary fs-6"></i>
                                </div>
                                <div>
                                  <h6 className="mb-1">Reminder</h6>
                                  <p className="m-0 text-muted">
                                    Enable reminders.
                                  </p>
                                </div>
                                <div className="form-check form-switch m-0 ms-auto">
                                  <input className="form-check-input" type="checkbox" role="switch" id="n9" />
                                </div>
                              </div>
                              <div className="list-group-item d-flex align-items-center gap-3">
                                <div className="icon-box md bg-primary-subtle rounded-3">
                                  <i className="bi bi-chat-dots text-primary fs-6"></i>
                                </div>
                                <div>
                                  <h6 className="mb-1">Comment</h6>
                                  <p className="m-0 text-muted">
                                    Comment on your post and replies.
                                  </p>
                                </div>
                                <div className="form-check form-switch m-0 ms-auto">
                                  <input className="form-check-input" type="checkbox" role="switch" id="n10" defaultChecked={false} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <!-- Row end --> */}

                      </div>
                      
                      {/* ca */}
                      <div className="tab-pane fade" id="pills-ca" role="tabpanel" aria-labelledby="pills-ca-tab"
                        tabIndex={0}>

                        {/* <!-- Row start --> */}
                        <div className="row gx-4">
                          <div className="col-sm-12">
                            <div className="border rounded-2 p-3 mb-3">
                              <div className="mb-4 bg-primary-subtle p-2 rounded-2">
                                Confirm your balances and click the link to withdraw
                              </div>

                              {/* <!-- Row start --> */}
                              <BalanceAndWithdrawal /> 

                            </div>
                          </div>
                        </div>
                        {/* <!-- Row end --> */}

                      </div>
                      {/* ca */}
                      <div className="tab-pane fade" id="pills-c" role="tabpanel" aria-labelledby="pills-c-tab"
                        tabIndex={0}>

                        {/* <!-- Row start --> */}
                        <div className="row gx-4">
                          <div className="col-sm-12">
                            <div className="border rounded-2 p-3 mb-3">
                              <div className="mb-4 bg-primary-subtle p-2 rounded-2">
                                You can upgrade and downgrade whenever you want.
                              </div>

                              {/* <!-- Row start --> */}
                              <Subscribe />
                              {/* <!-- Row end -->

                              <!-- Row start --> */}
                              <div className="row gx-4 justify-content-center">
                                <div className="col-sm-9">
                                  <div className="table-outer mb-3">
                                    <div className="table-responsive">
                                      <SubscriptionHistory />
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="col-sm-9">
                                  <div className="d-flex justify-content-end gap-1">
                                    <button className="btn btn-danger" type="button">Cancel</button>
                                    <button className="btn btn-primary" type="button">Save</button>
                                  </div>
                                </div> */}
                              </div>
                              {/* <!-- Row end --> */}

                            </div>
                          </div>
                        </div>
                        {/* <!-- Row end --> */}

                      </div>
                 
                      <div className="tab-pane fade" id="pills-e" role="tabpanel" aria-labelledby="pills-e-tab"
                        tabIndex={0}>

                        {/* <!-- Row start --> */}
                        <PasswordReset />
                        {/* <!-- Row end -->*/}

               

                      </div>
                      <div className="tab-pane fade" id="pills-f" role="tabpanel" aria-labelledby="pills-f-tab"
                        tabIndex={0}>

                        {/* <!-- Row start --> */}
                        <div className="row gx-4 justify-content-center">
                          <div className="col-sm-12">

                            {/* <!-- Data starts --> */}
                            <div className="bg-danger-subtle rounded-3 border border-danger">
                              <RequestDeletion />
                            </div>
                            {/* <!-- Data ends --> */}

                          </div>
                        </div>
                        {/* <!-- Row end --> */}
                      </div>
                    </div>
                    {/* <!-- Tabs ends --> */}

                  </div>
                </div>
              </div>
            </div>
            {/* <!-- Row end -->

            <!-- Toast message for download data example starts --> */}
            <div className="toast-container position-fixed bottom-0 end-0 p-3 mt-5">
              <div id="downloadData" className="toast text-bg-primary border-0" role="alert" aria-live="assertive"
                aria-atomic="true">
                <div className="toast-header">
                  <strong className="me-auto">Downloading</strong>
                  <small>Just now</small>
                  <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body">
                  Data successfully downloading.
                </div>
              </div>
            </div>
            {/* <!-- Toast message for download data example ends --> */}

          </div>
            {/* <!-- App body ends --> */}

      <JqueryMin />
      <BootstrapBundle />
      <MomentMin />
      <OverlayMin/>
      <OverlayScrollbarsInit/>
      <CustomMin />
    </div>
  );
}
