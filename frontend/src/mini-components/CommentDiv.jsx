export default function CommentDiv(params) {
  return (
    <>
      <div className="flex flex-row">
        <div className="bg-gray-500 flex flex-col w-[100%]">
          <textarea
            className="bg-gray-500 focus:outline-none"
            placeholder="Join Conversation"
          ></textarea>
          <div className="flex flex-row-reverse gap-0.5"> 
            <button className="bg-blue-600">Comment</button>
            <button className="bg-blue-600">Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
