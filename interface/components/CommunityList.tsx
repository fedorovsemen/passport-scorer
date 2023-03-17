// --- React components/methods
import React, { useEffect, useState, useCallback, useContext } from "react";

// --- Context
import { UserContext } from "../context/userContext";

// --- Components
import { CheckCircleIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import CommunityCard from "./CommunityCard";
import NoValues from "./NoValues";

// --- Utils
import {
  getCommunities,
  updateCommunity,
  deleteCommunity,
  Community,
} from "../utils/account-requests";

import UseCaseModal from "./UseCaseModal";
import { useToast } from "@chakra-ui/react";

const CommunityList = () => {
  const toast = useToast();
  const [selectUseCaseModalOpen, setSelectUseCaseModalOpen] = useState(false);
  const [error, setError] = useState<undefined | string>();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communityLoadingStatus, setCommunityLoadingStatus] =
    useState<string>("initial");
  const { logout } = useContext(UserContext);

  const fetchCommunities = useCallback(async () => {
    try {
      setCommunityLoadingStatus("loading");
      setCommunities(await getCommunities());
      setCommunityLoadingStatus("done");
    } catch (exc) {
      const error = exc as { response: { status: number } };
      setCommunityLoadingStatus("error");
      setError("There was an error fetching your Communities.");
      if (error.response.status === 401) {
        logout();
      }
    }
  }, []);

  useEffect(() => {
    const scorerCreated = Boolean(localStorage.getItem("scorerCreated"));

    if (scorerCreated) {
      toast({
        title: "Success!",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "solid",
        position: "bottom",
        render: () => (
          <div
            style={{
              backgroundColor: "#0E0333",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              padding: "16px",
            }}
          >
            <CheckCircleIcon color="#02E2AC" boxSize={6} mr={4} />
            <span style={{ color: "white", fontSize: "16px" }}>
              Your Scorer has been created.
            </span>
            <CloseIcon
              color="white"
              boxSize={3}
              ml="8"
              cursor="pointer"
              onClick={() => toast.closeAll()}
            />
          </div>
        ),
      });
      localStorage.removeItem("scorerCreated");
    }

    fetchCommunities();
  }, []);

  const handleUpdateCommunity = async (
    communityId: number,
    name: string,
    description: string
  ) => {
    await updateCommunity(communityId, { name, description });
    await fetchCommunities();
  };

  const handleDeleteCommunity = async (communityId: number) => {
    await deleteCommunity(communityId);
    await fetchCommunities();
  };

  const communityItems = communities.map((community: Community, i: number) => {
    return (
      <CommunityCard
        key={i}
        community={community}
        onCommunityDeleted={fetchCommunities}
        handleUpdateCommunity={handleUpdateCommunity}
        handleDeleteCommunity={handleDeleteCommunity}
      />
    );
  });

  const communityList = (
    <div className="overflow-hidden bg-white shadow md:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {communityItems}
      </ul>
    </div>
  );

  return (
    <>
      {communities.length === 0 ? (
        <NoValues
          title="Create a Scorer"
          description="Select unique scoring mechanisms that align with your application's goals."
          addActionText="Scorer"
          addRequest={() => {
            setSelectUseCaseModalOpen(true);
          }}
          icon={<img src="/assets/outlineStarIcon.svg" />}
        />
      ) : (
        <div className="mt-t mx-0">
          {communityList}

          <div className="mt-5 flex flex-wrap">
            <button
              className="rounded-md bg-purple-gitcoinpurple px-5 py-2 text-white"
              onClick={() => {
                setSelectUseCaseModalOpen(true);
              }}
              disabled={
                communityLoadingStatus !== "done" || communities.length >= 5
              }
            >
              <AddIcon className="mr-1" /> Scorer
            </button>
            <p className="ml-5 py-3 text-purple-softpurple">
              The scorer limit is 5
            </p>
          </div>
          {error && <div>{error}</div>}
        </div>
      )}
      <UseCaseModal
        isOpen={selectUseCaseModalOpen}
        onClose={() => setSelectUseCaseModalOpen(false)}
      />
    </>
  );
};

export default CommunityList;
