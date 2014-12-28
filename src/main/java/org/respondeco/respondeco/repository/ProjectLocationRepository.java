package org.respondeco.respondeco.repository;

import org.respondeco.respondeco.domain.ProjectLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data JPA repository for Project Location
 */
public interface ProjectLocationRepository extends JpaRepository<ProjectLocation, Long> {

    public ProjectLocation findByProjectId(Long projectId);

    public List<ProjectLocation> findByActiveIsTrue();

}
