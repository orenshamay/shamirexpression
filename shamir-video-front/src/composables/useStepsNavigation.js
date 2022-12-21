
const useStepsNavigation = (router, route) => {

    function nextStep() {
        const step = route.meta.step
        router.push(`/video/${route.params.videoId}/steps/${step + 1}`)
    }
    
    function previousStep() {
        const step = route.meta.step
        router.push(`/video/${route.params.videoId}/steps/${step - 1}`)
    }
    
    function goToStep(step) {
        router.push(`/video/${route.params.videoId}/steps/${step}`)
    }

    return [nextStep, previousStep, goToStep]
}

export default useStepsNavigation