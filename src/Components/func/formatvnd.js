function formatNumber(Number){
    return Number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
export default formatNumber;