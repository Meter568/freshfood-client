const Loading = () => {
    return (
        <div className="flex justify-center items-center my-57">
            <div className="flex-col gap-4 w-full flex items-center justify-center">
            <div
                className="w-22 h-22 border-4 border-transparent text-primary text-4xl animate-spin flex items-center justify-center border-t-primary rounded-full"
            >
                <div
                className="w-17 h-17 border-4 border-transparent text-primary text-2xl animate-spin flex items-center justify-center border-t-primary rounded-full"
                ></div>
            </div>
            </div>
        </div>
    )
}

export default Loading
