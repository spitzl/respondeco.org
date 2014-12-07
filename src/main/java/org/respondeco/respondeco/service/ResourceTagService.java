package org.respondeco.respondeco.service;

import org.respondeco.respondeco.domain.PropertyTag;
import org.respondeco.respondeco.domain.ResourceTag;
import org.respondeco.respondeco.repository.PropertyTagRepository;
import org.respondeco.respondeco.repository.ResourceTagRepository;
import org.respondeco.respondeco.web.rest.dto.PropertyTagResponseDTO;
import org.respondeco.respondeco.web.rest.util.RestParameters;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by clemens on 04/12/14.
 */
@Service
@Transactional
public class ResourceTagService {

    private ResourceTagRepository resourceTagRepository;

    @Inject
    public ResourceTagService(ResourceTagRepository resourceTagRepository) {
        this.resourceTagRepository = resourceTagRepository;
    }

    public List<ResourceTag> getResourceTags(String filter, RestParameters restParams) {
        Pageable pageable = null;
        List<String> fields = null;
        if(restParams != null) {
            pageable = restParams.buildPageRequest();
            fields = restParams.getFields();
        }
        if(filter == null) {
            filter = "";
        }
        List<ResourceTag> result = resourceTagRepository.findWhereNameLike(filter, pageable);
        return result;
    }

    public List<ResourceTag> getOrCreateTags(List<String> tagNames) {
        List<ResourceTag> response = new ArrayList<>();
        if(tagNames == null) {
            return response;
        }
        ResourceTag tag = null;
        for(String s : tagNames) {
            tag = resourceTagRepository.findByName(s);
            if(tag == null) {
                tag = new ResourceTag();
                tag.setName(s);
                tag = resourceTagRepository.save(tag);
            }
            response.add(tag);
        }
        return response;
    }

}