import instance from '@/helper/instance';
export const getLocation = async (lon, lat) => {
  try {
    const { data } = await instance.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { withCredentials: false }
    );
    return data?.address?.city || data?.address?.state_district || data?.address?.country;
  } catch (error) {
    console.log('getting error to fetch location', error?.message || error);
  }
};
