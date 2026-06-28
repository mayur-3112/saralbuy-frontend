$content = Get-Content -Raw -Path "c:\Users\Mayur Agarwal\Desktop\Saralbuy\frontend_v2\src\pages\ProductOverview.jsx"
$newContent = @"
              {/* Left Column: Sections */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Requirement Specifications */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6 hover:shadow-md transition-shadow">
                  <h3 className="font-extrabold text-slate-800 text-2xl tracking-tight border-b border-slate-100 pb-4">
                    Requirement Specifications
                  </h3>
                  
                  {/* Requested Items (Moved Here) */}
                  {(bidOverviewRes?.product?.isMultiple || productResponse?.mainProduct?.isMultiple) && (
                    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-lg">Requested Items</h3>
                        <span className="text-sm font-medium text-gray-500">{(bidOverviewRes?.product?.items || productResponse?.mainProduct?.items || []).length} items</span>
                      </div>
                      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50">
                        {(bidOverviewRes?.product?.items || productResponse?.mainProduct?.items || []).map((item, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 rounded-md p-4 flex flex-col justify-between hover:border-orange-300 hover:shadow-sm transition-all">
                            <div className="mb-3">
                              <h4 className="font-bold text-gray-900 text-base mb-1">{item.subCategoryName || "N/A"}</h4>
                              <div className="text-sm text-gray-500 space-y-1">
                                <p><span className="font-medium text-gray-400">Brand:</span> {item.brand || "N/A"}</p>
                                <p><span className="font-medium text-gray-400">Model/Type:</span> {item.typeOfProduct || item.model || "N/A"}</p>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Required Qty</span>
                              <div className="font-black text-orange-600 text-lg">
                                {item.quantity} <span className="text-sm font-bold text-gray-500 ml-0.5">{item.quantityUnit}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* General Specs */}
                  <div className="text-[15px] space-y-1 text-slate-600 font-medium">
                    <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100 capitalize">
                      <span className="font-semibold">Product Condition:</span>
                      {(bidOverviewRes ? bidOverviewRes?.product?.subCategory?.name : productResponse?.mainProduct?.categoryId?.categoryName) || "N/A"}
                    </p>
                    <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100 capitalize">
                      <span className="font-semibold">Brand:</span>
                      {(bidOverviewRes ? otherBrandValue(bidOverviewRes?.product) : otherBrandValue(productResponse?.mainProduct)) || "N/A"}
                    </p>
                    {(bidOverviewRes?.product?.model || productResponse?.mainProduct?.model) && (
                      <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100 capitalize">
                        <span className="font-semibold">Model:</span>
                        {(bidOverviewRes ? bidOverviewRes?.product?.model : productResponse?.mainProduct?.model) || "N/A"}
                      </p>
                    )}
                    {(bidOverviewRes?.product?.productType || productResponse?.mainProduct?.productType) && (
                      <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100 capitalize">
                        <span className="font-semibold">Product Type:</span>
                        {(bidOverviewRes ? bidOverviewRes?.product?.productType : productResponse?.mainProduct?.productType)?.replace("_", " ") || "N/A"}
                      </p>
                    )}
                    {(bidOverviewRes?.product?.minimumBudget || productResponse?.mainProduct?.minimumBudget) && (
                      <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100">
                        <span className="font-semibold">Budget:</span>
                        {currencyConvertor(bidOverviewRes ? bidOverviewRes?.product?.minimumBudget : productResponse?.mainProduct?.minimumBudget)}
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Delivery Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6 hover:shadow-md transition-shadow">
                  <h3 className="font-extrabold text-slate-800 text-2xl tracking-tight border-b border-slate-100 pb-4">
                    Delivery Information
                  </h3>
                  <div className="text-[15px] space-y-1 text-slate-600 font-medium">
                    <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100">
                      <span className="font-semibold">Delivery Location:</span>
                      <span className="capitalize">{
                        (bidOverviewRes ? bidOverviewRes?.buyer?.address : productResponse?.mainProduct?.userId?.address)?.split(",").slice(-2).join(",") || "N/A"
                      }</span>
                    </p>
                    {(() => {
                      const expiryDateStr = bidOverviewRes?.product?.bidExpiryDate || productResponse?.mainProduct?.bidExpiryDate || bidOverviewRes?.product?.timeline || productResponse?.mainProduct?.timeline || bidOverviewRes?.product?.bidActiveDuration || productResponse?.mainProduct?.bidActiveDuration;
                      const createdAt = bidOverviewRes?.product?.createdAt || productResponse?.mainProduct?.createdAt;
                      let expiryDateObj = null;
                      if (expiryDateStr && isNaN(Number(expiryDateStr))) {
                        expiryDateObj = new Date(expiryDateStr);
                      } else if (expiryDateStr && !isNaN(Number(expiryDateStr))) {
                         const days = Number(expiryDateStr);
                         expiryDateObj = new Date(new Date(createdAt || Date.now()).getTime() + days * 24 * 60 * 60 * 1000);
                      }
                      if (expiryDateObj && !isNaN(expiryDateObj.getTime())) {
                        return (
                          <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100 text-red-600">
                            <span className="font-semibold">Bid Valid Until:</span>
                            {dateFormatter(expiryDateObj)}
                          </p>
                        );
                      }
                      return null;
                    })()}
                    <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100">
                      <span className="font-semibold">Required Delivery Date:</span>
                      {dateFormatter(bidOverviewRes ? bidOverviewRes?.product?.paymentAndDelivery?.ex_deliveryDate : productResponse?.mainProduct?.paymentAndDelivery?.ex_deliveryDate) || "N/A"}
                    </p>
                    <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100 capitalize">
                      <span className="font-semibold">Payment Mode:</span>
                      {(bidOverviewRes ? bidOverviewRes?.product?.paymentAndDelivery?.paymentMode : productResponse?.mainProduct?.paymentAndDelivery?.paymentMode) || "N/A"}
                    </p>
                  </div>
                </div>

                {/* 3. Attachments */}
                {(bidOverviewRes?.product?.isUpload || productResponse?.mainProduct?.isUpload || productResponse?.mainProduct?.document || bidOverviewRes?.product?.document) && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6 hover:shadow-md transition-shadow">
                    <h3 className="font-extrabold text-slate-800 text-2xl tracking-tight border-b border-slate-100 pb-4">
                      Attachments
                    </h3>
                    <div className="border-2 border-slate-100 bg-slate-50 rounded-lg p-5 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">Requirements Document</h4>
                        <p className="text-sm text-gray-600 mt-1">Download to view full bill of materials and specs.</p>
                      </div>
                      <a 
                        href={bidOverviewRes?.product?.document || productResponse?.mainProduct?.document}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-md font-semibold transition-colors shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Attachment
                      </a>
                    </div>
                  </div>
                )}

                {/* 4. Contact Details (Secure) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="font-extrabold text-slate-800 text-2xl tracking-tight">
                      Contact Details
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      GST Verified Buyer
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {[
                      { label: "Contact Person", icon: "user" },
                      { label: "Contact Mobile", icon: "phone" },
                      { label: "Contact Email", icon: "mail" },
                      { label: "Contact WhatsApp", icon: "message" }
                    ].map((detail, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-lg p-5 flex flex-col justify-between h-[100px] bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all group">
                        <span className="text-sm font-semibold text-slate-500">{detail.label}</span>
                        <div className="flex justify-between items-center mt-2">
                          <button 
                            onClick={() => {
                              toast.info("Submit a quote first to unlock contact details.");
                            }}
                            className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:text-indigo-700 hover:underline"
                          >
                            View
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
"@
$content = $content -replace "(?s)              \{\/\* Left: Requirement Spec \*\/}.*?              <\/div>\r?\n\r?\n              \{\/\* Right: Form \*\/}", "`$newContent`n`n              {/* Right: Form */}"
Set-Content -Path "c:\Users\Mayur Agarwal\Desktop\Saralbuy\frontend_v2\src\pages\ProductOverview.jsx" -Value $content

