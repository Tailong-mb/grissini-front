import sanity from '@/utils/sanity';

export const useSanityHome = async () => {
	try {
		const query = `*[_type == "home"][0]{
      "title": title,
      "subtitle": subtitle,
      "description": description,
      "heroVideo": {
        "thumbnailMobile": heroVideo.thumbnailMobile{
          asset->{
            _id,
            url,
            metadata
          }
        },
        "thumbnailDesktop": heroVideo.thumbnailDesktop{
          asset->{
            _id,
            url,
            metadata
          }
        },
        "videoMobile": heroVideo.videoMobile{
          asset->{
            _id,
            url,
            originalFilename
          }
        },
        "videoDesktop": heroVideo.videoDesktop{
          asset->{
            _id,
            url,
            originalFilename
          }
        }
      },
      "modules": modules[]{
        _type,
        _key,
        ...,
        "title": title,
        "subtitle": subtitle,
        "description": description,
        "text": text,
        "buttonText": buttonText,
        "linkText": linkText,
        "video": {
          "thumbnailMobile": video.thumbnailMobile{
            asset->{
              _id,
              url,
              metadata
            }
          },
          "thumbnailDesktop": video.thumbnailDesktop{
            asset->{
              _id,
              url,
              metadata
            }
          },
          "videoMobile": video.videoMobile{
            asset->{
              _id,
              url,
              originalFilename
            }
          },
          "videoDesktop": video.videoDesktop{
            asset->{
              _id,
              url,
              originalFilename
            }
          }
        },
        "image": image{
          asset->{
            _id,
            url,
            metadata
          }
        },
        "images": images[]{
          asset->{
            _id,
            url,
            metadata
          }
        }
      },
      "seo": seo
    }`;

		const data = await sanity.fetch(query);
		return data;
	} catch (error) {
		console.error('Error fetching home data:', error);
		throw error;
	}
};
