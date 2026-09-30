import GetPackages, { GetPackagesParams } from "../action/get-packages";
import PackagesManagement from "./packages-management";

export default async function Packages({
  params,
}: {
  params: GetPackagesParams;
}) {
  const response = await GetPackages(params);
  if (!response.success) {
    return <div>{response.message}</div>;
  }
  return <PackagesManagement data={response.data} />;
}
