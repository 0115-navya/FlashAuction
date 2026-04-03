import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";
import { socket } from "../utils/socket";

const AuctionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [bidLoading, setBidLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await axios.get(`/auctions/${id}`);
        setAuction(res.data.auction);
        setBids(res.data.bids);
      } catch (err) {
        setError("Auction not found");
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id]);

  useEffect(() => {
    socket.connect();
    socket.emit("join_auction", id);
    socket.on("bid_placed", (data) => {
      setAuction((prev) =>
        prev ? { ...prev, currentPrice: data.currentPrice } : prev,
      );
      setBids((prev) => {
        if (!data || data.amount === undefined) return prev;
        return [data, ...prev];
      });
      setError("");
      setSuccess(
        `New bid: ₹${data.amount.toLocaleString()} by ${data.bidder.name}`,
      );
    });
    socket.on("bid_error", (data) => {
      setError(data.message);
      setSuccess("");
    });
    return () => {
      socket.emit("leave_auction", id);
      socket.off("bid_placed");
      socket.off("bid_error");
    };
  }, [id]);

  const handleBid = async (e) => {
    e.preventDefault();
    setBidLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(`/auctions/${id}/bid`, {
        header: { Authorization: `Bearer ${user.token}` },
        amount: bidAmount,
      });
      setBidAmount("");
      setSuccess("Bid placed successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place bid");
    } finally {
      setBidLoading(false);
    }
  };

  useEffect(() => {
    if (!auction) return;
    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(auction.endTime);
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft("Ended");
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(
        days > 0
          ? `${days}d ${hours}h ${minutes}m ${seconds}s`
          : `${hours}h ${minutes}m ${seconds}s`,
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [auction]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!auction)
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center text-slate-400">
        Auction not found.
      </div>
    );

  const isOwner = user && auction.createdBy._id === user.id;
  const isActive = auction.status === "active";
  const currentPrice = auction?.currentPrice || auction?.startingPrice || 0;
  const minBid =
    auction?.currentPrice + 1
      ? Number(auction.currentPrice) + 1
      : Number(auction?.startingPrice || 0) + 1;

  const statusConfig = {
    active: "bg-green-500/20 text-green-400 border border-green-500/30",
    upcoming: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    ended: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a] py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-dark-100 border border-white/10 h-72 mb-6">
            {auction.image ? (
              <img
                src={auction.image}
                alt={auction.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-7xl opacity-20">
                🏷️
              </div>
            )}
          </div>

          <div className="bg-dark-100 border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-3">
              <h1 className="text-white text-2xl font-bold">{auction.title}</h1>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${statusConfig[auction.status]}`}
              >
                {auction.status.toUpperCase()}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {auction.description}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                {
                  label: "Starting Price",
                  value: `₹${auction.startingPrice.toLocaleString()}`,
                },
                {
                  label: "Current Price",
                  value: `₹${auction?.currentPrice?.toLocaleString()}`,
                  highlight: true,
                },
                { label: "Total Bids", value: bids.length },
              ].map((s, i) => (
                <div key={i} className="bg-dark-200 rounded-xl p-3 text-center">
                  <p className="text-slate-500 text-xs mb-1">{s.label}</p>
                  <p
                    className={`font-bold text-lg ${s.highlight ? "text-primary" : "text-white"}`}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {isActive && (
              <div className="bg-dark-200 rounded-xl px-4 py-3 flex justify-between items-center mb-4">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Time Remaining
                </span>
                <span className="text-primary font-bold font-mono">
                  {timeLeft}
                </span>
              </div>
            )}

            {auction.status === "ended" && auction.winner && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-400 text-sm mb-4">
                🏆 Won by <strong>{auction.winner.name}</strong>
              </div>
            )}

            <p className="text-slate-600 text-xs">
              Created by:{" "}
              <span className="text-slate-400">{auction.createdBy.name}</span>
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {/* Bid Form */}
          {isActive && !isOwner && (
            <div className="bg-dark-100 border border-white/10 rounded-2xl p-6 mb-6">
              <h2 className="text-white font-bold text-lg mb-1">
                Place Your Bid
              </h2>
              <p className="text-slate-500 text-sm mb-4">
                Minimum:{" "}
                <span className="text-primary font-semibold">
                  ₹{minBid.toLocaleString()}
                </span>
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2.5 rounded-xl text-sm mb-4">
                  ✅ {success}
                </div>
              )}

              {user ? (
                <form onSubmit={handleBid}>
                  <div className="flex border border-white/10 rounded-xl overflow-hidden mb-3 focus-within:border-primary transition">
                    <span className="bg-dark-200 text-slate-400 px-4 py-3 font-bold border-r border-white/10">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder={`Min ${minBid}`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={minBid}
                      required
                      className="flex-1 bg-transparent text-white px-4 py-3 outline-none text-sm placeholder-slate-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={bidLoading}
                    className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm transition"
                  >
                    {bidLoading ? "Placing..." : "⚡ Place Bid"}
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-primary hover:opacity-90 text-white py-3 rounded-xl font-bold text-sm transition"
                >
                  Login to Bid
                </button>
              )}
            </div>
          )}

          {isOwner && isActive && (
            <div>
              <div className="bg-dark-100 border border-white/10 rounded-2xl p-5 text-center text-slate-400 text-sm mb-6">
                You created this auction and cannot bid on it.
              </div>
              <button
                onClick={() => navigate(`/edit-auction/${auction._id}`)}
                className="w-full py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                ✏️ Edit Auction
              </button>
            </div>
          )}

          {auction.status === "upcoming" && (
            <div className="bg-dark-100 border border-white/10 rounded-2xl p-5 text-center text-slate-400 text-sm mb-6">
              ⏳ This auction hasn't started yet.
            </div>
          )}

          {/* Bid History */}
          <div className="bg-dark-100 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">
              Bid History{" "}
              <span className="text-slate-500 font-normal text-sm">
                ({bids.length})
              </span>
            </h2>
            {bids.length === 0 ? (
              <p className="text-slate-600 text-center py-8">
                No bids yet. Be the first!
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {bids.map((bid, index) => (
                  <div
                    key={bid?._id || index}
                    className={`flex justify-between items-center p-3 rounded-xl ${
                      index === 0
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-dark-200 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 text-xs w-6">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {bid?.bidder?.name || "Unknown User"}
                        </p>
                        <p className="text-slate-600 text-xs">
                          {new Date(bid?.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-bold text-sm ${index === 0 ? "text-primary" : "text-slate-300"}`}
                    >
                      ₹{bid?.amount?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
