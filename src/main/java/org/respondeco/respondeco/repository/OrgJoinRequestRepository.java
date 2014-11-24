package org.respondeco.respondeco.repository;

import org.respondeco.respondeco.domain.OrgJoinRequest;
        import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data JPA repository for the OrgJoinRequest entity.
 */
public interface OrgJoinRequestRepository extends JpaRepository<OrgJoinRequest, Long> {
    List<OrgJoinRequest> findByOrgId(Long orgId);
    List<OrgJoinRequest> findByUserId(Long userId);
}