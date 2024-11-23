import { useContext, useEffect } from "react";
import { FeedItemDataContext } from "../../context/feedItemData";
import FeedHomeContainer from "../../components/FeedHomeContainer/FeedHomeContainer";
import { useNavigate } from "@tanstack/react-router";

function FeedItemPage() {
  const { feedItemData } = useContext(FeedItemDataContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!feedItemData) {
      navigate({ to: "/" });
    }
  }, [feedItemData, navigate]);
  return (
    <FeedHomeContainer>
      {feedItemData && (
        <div>
          <div className="border-b py-3">
            <button onClick={() => window.history.back()}>Back</button>
          </div>
          <p>{feedItemData.title}</p>
          <p dangerouslySetInnerHTML={{ __html: feedItemData.content || "" }} />
        </div>
      )}
    </FeedHomeContainer>
  );
}

export default FeedItemPage;
