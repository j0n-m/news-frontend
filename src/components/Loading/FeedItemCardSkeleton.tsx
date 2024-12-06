import { Skeleton } from "../ui/skeleton";

function FeedItemCardSkeleton() {
  return (
    <div className="flex gap-3">
      <div className="flex-1 flex flex-col">
        <Skeleton className="h-[30px]"></Skeleton>
        <Skeleton className="w-[100px] mt-2 h-[20px]"></Skeleton>
      </div>
      <div>
        <Skeleton className="aspect-square rounded-sm h-[80px]"></Skeleton>
      </div>
    </div>
  );
}
export default FeedItemCardSkeleton;
