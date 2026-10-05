import GetGameDetail from "../actions/get-gamedetail";
import GameManagement from "./game-mangement";

export default async function Game({ gameCode }: { gameCode: string }) {
  const response = await GetGameDetail({ gameCode });
  if (!response.success) {
    return <div>Error in getting games details</div>;
  }
  return (
    <div>
      <GameManagement game={response.data} />
    </div>
  );
}
{
}
