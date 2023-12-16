export function Code() {
    return (
        <div className="flex w-full h-screen bg-red-200">
            {/* <iframe id="iFrameExample"
            className="w-full h-full"
            title="iFrame Example"
            src="https://en.wikipedia.org/wiki/Harris_corner_detector">
            </iframe> */}
            <object data="https://en.wikipedia.org/wiki/Harris_corner_detector" className="w-full h-full">
            <embed src="https://en.wikipedia.org/wiki/Harris_corner_detector"></embed>
            </object>
        </div>
    );
}