import GetGames, { GetGamesParams } from "../actions/get-games";
import GamesManagement from "./games-management";

export default async function Games({
  params,
}: {
  params: GetGamesParams;
}) {
  const response = await GetGames(params);
  if (!response.success) {
    return <div>{response.message}</div>;
  }
  return (
    <div>
      <GamesManagement data={response.data} />
    </div>
  );
}
