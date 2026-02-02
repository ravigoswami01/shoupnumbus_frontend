import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Reletedproduct from "../components/Reletedproduct";
import axios from "axios";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, currency, addToCart, BackendURL } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [newReview, setNewReview] = useState({
    email: "",
    rating: 5,
    comment: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (products) {
      const product = products.find((item) => item._id === productId);
      if (product) {
        setProductData(product);
        setSelectedImage(product.image[0]);
        fetchReviews(productId);
      }
    }
  }, [productId, products]);

  const fetchReviews = async (productId) => {
    try {
      setIsLoadingReviews(true);
      const response = await axios.get(`${BackendURL}/api/Costomer/feedback_List`);
      const allReviews = response?.data?.feedbackList || {};
      const productReviews = allReviews.filter(
        (review) => review?.productId === productId
      );
      setReviews(productReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const getReviewDate = (review) => {
    if (review.createdAt) {
      return new Date(review.createdAt).toLocaleDateString();
    }
    if (review._id && review._id.length === 24) {
      const timestamp = parseInt(review._id.substring(0, 8), 16);
      return new Date(timestamp * 1000).toLocaleDateString();
    }
    return;
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 4;
    const maxSize = 2 * 1024 * 1024;
    const filesToProcess = files.slice(0, maxFiles - selectedFiles.length);
    const validFiles = filesToProcess.filter((file) => {
      return file.type.startsWith("image/") && file.size <= maxSize;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, maxFiles));

    const newPreviews = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = {
          file,
          url: e.target.result,
          id: Date.now() + Math.random(),
        };
        newPreviews.push(preview);
        if (newPreviews.length === validFiles.length) {
          setPreviewImages((prev) =>
            [...prev, ...newPreviews].slice(0, maxFiles)
          );
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setPreviewImages((prev) => prev.filter((img) => img.id !== imageId));
    setSelectedFiles((prev) => {
      const imageToRemove = previewImages.find((img) => img.id === imageId);
      return prev.filter((file) => file !== imageToRemove?.file);
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("email", newReview.email);
      formData.append("rating", newReview.rating);
      formData.append("comment", newReview.comment);

      selectedFiles.slice(0, 4).forEach((file, index) => {
        formData.append(`image${index + 1}`, file);
      });

      await axios.post(`${BackendURL}/api/Costomer/feedback_user`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewReview({ email: "", rating: 5, comment: "" });
      setSelectedFiles([]);
      setPreviewImages([]);
      setShowReviewForm(false);
      fetchReviews(productId);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.message || "Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 4.0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        type={interactive ? "button" : undefined}
        onClick={
          interactive && onRatingChange
            ? () => onRatingChange(index + 1)
            : undefined
        }
        disabled={!interactive}
        className={`${interactive ? "cursor-pointer hover:scale-110" : ""} transition-transform`}
      >
        <svg
          className={`w-5 h-5 ${
            index < rating ? "fill-amber-400" : "fill-gray-200"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={
            index >= rating
              ? {
                  filter: "drop-shadow(0 0 1px rgba(0,0,0,0.3))",
                  stroke: "#d1d5db",
                  strokeWidth: "1",
                }
              : {}
          }
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </button>
    ));
  };

  const isSizeAvailable =
    productData?.size &&
    Array.isArray(productData.size) &&
    typeof productData.size[0] === "string" &&
    productData.size[0].startsWith("[");

  const handleAddToCart = () => {
    addToCart(productData._id, isSizeAvailable ? size : quantity);
  };

  const handleViewCart = () => {
    navigate("/cart");
  };

  const truncateDescription = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ");
  };

  const shouldShowReadMore = (text) => {
    if (!text) return false;
    return text.split(" ").length > 50;
  };

  return productData ? (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="hover:text-orange-600 cursor-pointer transition">Home</span>
          <span>/</span>
          <span className="hover:text-orange-600 cursor-pointer transition">Products</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{productData.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-100 group">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={selectedImage}
                alt={productData.name}
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {Array.isArray(productData.image) ? (
                productData.image.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(item)}
                    className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:shadow-lg ${
                      item === selectedImage
                        ? "border-orange-500 shadow-lg ring-2 ring-orange-200"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={item}
                      alt={`Product ${index + 1}`}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center py-8 text-gray-400">
                  No images available
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                {productData.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(Math.round(getAverageRating()))}
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {getAverageRating()}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold text-orange-600">
                  {currency}
                  {productData.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
              <p className="text-gray-700 leading-relaxed">
                {showFullDescription
                  ? productData.description
                  : truncateDescription(productData.description, 50)}
                {!showFullDescription &&
                  shouldShowReadMore(productData.description) && (
                    <>
                      ...{" "}
                      <button
                        onClick={() => setShowFullDescription(true)}
                        className="text-orange-600 font-semibold hover:text-orange-700 underline transition"
                      >
                        Read More
                      </button>
                    </>
                  )}
                {showFullDescription && shouldShowReadMore(productData.description) && (
                  <>
                    {" "}
                    <button
                      onClick={() => setShowFullDescription(false)}
                      className="text-orange-600 font-semibold hover:text-orange-700 underline transition"
                    >
                      Show Less
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Size/Quantity Selection */}
            {isSizeAvailable ? (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Select Size:
                </label>
                <div className="flex flex-wrap gap-3">
                  {(() => {
                    let sizes = [];
                    if (
                      Array.isArray(productData.size) &&
                      typeof productData.size[0] === "string"
                    ) {
                      try {
                        sizes = JSON.parse(productData.size[0]);
                      } catch (err) {
                        console.error("Failed to parse sizes:", err);
                      }
                    } else if (typeof productData.size === "string") {
                      sizes = productData.size.split(",");
                    } else if (Array.isArray(productData.size)) {
                      sizes = productData.size;
                    }
                    return sizes.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setSize(item.trim())}
                        className={`min-w-[70px] px-5 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                          item.trim() === size
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105 ring-2 ring-orange-300"
                            : "bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-400 hover:shadow-md"
                        }`}
                      >
                        {item.trim()}
                      </button>
                    ));
                  })()}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                    className="w-12 h-12 rounded-lg bg-white border-2 border-gray-300 hover:border-orange-400 hover:shadow-md flex items-center justify-center text-xl font-bold text-gray-700 transition-all"
                  >
                    -
                  </button>
                  <div className="w-20 h-12 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 flex items-center justify-center text-xl font-bold text-gray-900">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="w-12 h-12 rounded-lg bg-white border-2 border-gray-300 hover:border-orange-400 hover:shadow-md flex items-center justify-center text-xl font-bold text-gray-700 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Add to Cart
              </button>
              <button
                onClick={handleViewCart}
                className="flex-1 bg-white text-orange-600 py-4 px-8 rounded-xl font-bold text-lg border-2 border-orange-500 hover:bg-orange-50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                View Cart
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-3 pt-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✅</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  100% Original Products
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🚚</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Cash On Delivery available
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🔁</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Easy return and exchange within 7 days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-4 px-2 text-lg font-semibold transition-all relative ${
                  activeTab === "description"
                    ? "text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Description
                {activeTab === "description" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-4 px-2 text-lg font-semibold transition-all relative ${
                  activeTab === "reviews"
                    ? "text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews ({reviews.length})
                {activeTab === "reviews" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"></div>
                )}
              </button>
            </div>
          </div>

          <div className="py-10">
            {activeTab === "description" ? (
              <div className="max-w-4xl space-y-6">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
                  <p className="text-lg text-gray-700 leading-relaxed italic mb-4">
                    "Starting my beauty store was the best decision I ever made. It's
                    simple, user-friendly, and supports my income goals."
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
                    praesentium suscipit consectetur dignissimos distinctio omnis
                    assumenda, in, quod atque aut quisquam?
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Reviews Header */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Customer Reviews
                  </h2>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      {renderStars(Math.round(getAverageRating()))}
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-gray-900">
                        {getAverageRating()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Based on {reviews.length}{" "}
                        {reviews.length === 1 ? "review" : "reviews"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Write Your Review
                    </h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={newReview.email}
                          onChange={(e) =>
                            setNewReview({ ...newReview, email: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                          placeholder="your.email@example.com"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Rating *
                        </label>
                        <div className="flex gap-2">
                          {renderStars(newReview.rating, !isSubmitting, (rating) =>
                            setNewReview({ ...newReview, rating })
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Your Review *
                        </label>
                        <textarea
                          required
                          rows="5"
                          value={newReview.comment}
                          onChange={(e) =>
                            setNewReview({ ...newReview, comment: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                          placeholder="Tell others what you think about this product..."
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Add Photos (Optional) - Max 4 images
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelect}
                            className="hidden"
                            id="review-images"
                            disabled={isSubmitting || selectedFiles.length >= 4}
                          />
                          <label
                            htmlFor="review-images"
                            className="cursor-pointer"
                          >
                            <div className="text-4xl mb-2">📷</div>
                            <div className="text-gray-600">
                              <span className="text-orange-600 font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              PNG, JPG up to 2MB (Max 4 images)
                            </div>
                          </label>
                        </div>

                        {previewImages.length > 0 && (
                          <div className="grid grid-cols-4 gap-3 mt-4">
                            {previewImages.map((image) => (
                              <div key={image.id} className="relative group">
                                <img
                                  src={image.url}
                                  alt="Preview"
                                  className="w-full aspect-square object-cover rounded-xl border-2 border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(image.id)}
                                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold transition-all shadow-md hover:shadow-lg"
                                  disabled={isSubmitting}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {selectedFiles.length >= 4 && (
                          <p className="text-sm text-orange-600 font-medium mt-2">
                            Maximum 4 images allowed
                          </p>
                        )}
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowReviewForm(false);
                            setSelectedFiles([]);
                            setPreviewImages([]);
                          }}
                          disabled={isSubmitting}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {isLoadingReviews ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500"></div>
                      <p className="mt-4 text-gray-600">Loading reviews...</p>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-12 text-center border border-orange-100">
                      <div className="text-6xl mb-4">⭐</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-gray-600">
                        Be the first to review this product!
                      </p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review._id}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {getReviewDate(review)}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {review.comment}
                        </p>
                        {review.image && review.image.length > 0 && (
                          <div className="grid grid-cols-4 gap-3">
                            {review.image.map((imageUrl, index) => (
                              <img
                                key={index}
                                src={imageUrl}
                                alt={`Review ${index + 1}`}
                                className="w-full aspect-square object-cover rounded-xl cursor-pointer hover:opacity-90 transition border border-gray-200"
                                onClick={() => window.open(imageUrl, "_blank")}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <Reletedproduct
            category={productData.category}
            subCategory={productData.subCategory}
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading product...</p>
      </div>
    </div>
  );
};

export default Product;